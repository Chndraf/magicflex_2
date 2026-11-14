/**
 * Vercel Serverless Function for Groq AI Feedback
 * Endpoint: /api/groq
 * Multi-model fallback support for high reliability
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

    // List of reliable Groq models to try in order of preference
    const modelsToTry = [
      'llama-3.1-8b-instant',
      'llama-3.3-70b-versatile',
      'llama3-70b-8192',
      'mixtral-8x7b-32768',
      'gemma2-9b-it'
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
                content: 'You are a friendly and encouraging CSS Flexbox tutor. Provide concise, practical learning feedback in 1 coherent paragraph (max 100-120 words). Complete your sentences fully and never cut off mid-sentence.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 600
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
