/**
 * Vercel Serverless Function for Groq AI Feedback
 * Endpoint: /api/groq
 * Multi-model fallback support using active Groq models
 */

export default async function handler(req, res) {
  // Set CORS headers for security
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY belum disetel di Environment Variables Vercel.'
    });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt text is required.' });
    }

    // List of active, supported Groq models to try in order of preference
   const modelsToTry = [
     'openai/gpt-oss-20b',
     'openai/gpt-oss-120b'
   ];

    let lastError = null;
    let aiText = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
  model: modelName,
  messages: [
    {
      role: 'system',
      content: 'You are a friendly and encouraging CSS Flexbox tutor for beginner students. Follow the language rules and answer format in the user message exactly. Use simple everyday words and short sentences, reply in the language the user message asks for, keep it under 120 words, and always finish every sentence.'
    },
    {
      role: 'user',
      content: prompt
    }
  ],
  temperature: 0.5,
  max_completion_tokens: 2000,
  reasoning_effort: 'low'
})
        });

        const responseText = await response.text();
        let data;
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          lastError = 'Groq returned a non-JSON response.';
          continue;
        }

        if (!response.ok) {
          lastError = data.error?.message || `Groq API failed with HTTP ${response.status}`;
          console.warn(`Model ${modelName} failed:`, lastError);
          continue;
        }

        aiText = data.choices?.[0]?.message?.content;
        if (!aiText) {
          lastError = 'Groq API did not return valid content.';
          continue;
        }

        // Successfully got response from modelName
        break;
      } catch (err) {
        lastError = err.message;
        console.warn(`Model ${modelName} encountered error:`, err);
      }
    }

    if (!aiText) {
      return res.status(502).json({
        error: lastError || 'Groq API tidak mengembalikan respons yang valid dari model yang dicoba.'
      });
    }

    // Return in Gemini-compatible format for frontend compatibility
    return res.status(200).json({ 
      candidates: [{ 
        content: { 
          parts: [{ text: aiText }] 
        } 
      }] 
    });
  } catch (error) {
    console.error('Groq serverless function failed:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
