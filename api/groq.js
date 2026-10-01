/**
 * Vercel Serverless Function for Groq AI Feedback
 * Endpoint: /api/groq
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

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful and friendly educational assistant. Provide brief, friendly, motivating, and practical feedback to help improve learning. Keep responses concise (1 paragraph max).'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 512
      })
    });

    const responseText = await response.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('Groq API returned a non-JSON response:', response.status);
      return res.status(502).json({
        error: 'Groq API mengembalikan respons tidak valid. Periksa Vercel Function Logs.'
      });
    }

    if (!response.ok) {
      console.error('Groq API request failed:', response.status, data.error?.message);
      return res.status(response.status).json({
        error: data.error?.message || `Groq API gagal diproses (HTTP ${response.status}).`
      });
    }

    // Extract the AI response text from Groq's response format
    const aiText = data.choices?.[0]?.message?.content;
    if (!aiText) {
      return res.status(500).json({
        error: 'Groq API tidak mengembalikan respons yang valid.'
      });
    }

    return res.status(200).json({ candidates: [{ content: { parts: [{ text: aiText }] } }] });
  } catch (error) {
    console.error('Groq serverless function failed:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
