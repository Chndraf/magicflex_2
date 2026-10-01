/**
 * Vercel Serverless Function for Gemini AI Feedback
 * Endpoint: /api/gemini
 * Using gemini-1.5-flash - stable and widely available model
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY belum disetel di Environment Variables Vercel.'
    });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt text is required.' });
    }

    // Use gemini-1.5-pro - very stable and widely available
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ 
            parts: [{ 
              text: prompt 
            }] 
          }] 
        })
      }
    );

    const responseText = await response.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('Gemini returned a non-JSON response:', response.status);
      return res.status(502).json({
        error: 'Gemini API mengembalikan respons tidak valid. Periksa Vercel Function Logs.'
      });
    }

    if (!response.ok) {
      console.error('Gemini API request failed:', response.status, data.error?.message);
      return res.status(response.status).json({
        error: data.error?.message || `Gemini API gagal diproses (HTTP ${response.status}).`
      });
    }

    // Extract the AI response text from Gemini's response format
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
      return res.status(500).json({
        error: 'Gemini API tidak mengembalikan respons yang valid.'
      });
    }

    return res.status(200).json({ 
      candidates: [{ 
        content: { 
          parts: [{ text: aiText }] 
        } 
      }] 
    });
  } catch (error) {
    console.error('Gemini serverless function failed:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
