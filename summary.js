// api/summary.js
// Vercel serverless function — keeps your API key secure on the server
// Proxies requests to Anthropic and streams the response back to the browser

export const config = {
  runtime: 'edge', // Edge runtime = fastest cold start, streams natively
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return new Response('API key not configured', { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { prompt } = body;
  if (!prompt) {
    return new Response('Missing prompt', { status: 400 });
  }

  // Call Anthropic API with streaming
  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 350,
      stream: true,
      system:
        'You are a clinical documentation AI. Output ONLY a brief physician intake summary using bullet points. No preamble, no explanation, no extra text. Be extremely concise — 1-2 bullets per section maximum. Always respond in English regardless of input language.',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const error = await anthropicRes.text();
    return new Response(`Anthropic error: ${error}`, {
      status: anthropicRes.status,
    });
  }

  // Stream Anthropic's response directly back to the browser
  return new Response(anthropicRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
