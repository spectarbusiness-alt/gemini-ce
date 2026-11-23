const MODEL = 'google/gemini-2.5-flash';
const MAX_TOKENS = 4096;

const jsonResponse = (body: unknown, status: number) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});

export async function handleChatRequest(request: Request, apiKey?: string): Promise<Response> {
	if (request.method !== 'POST') {
		return jsonResponse({ error: { message: 'Method not allowed.' } }, 405);
	}

	if (!apiKey?.trim()) {
		return jsonResponse(
			{ error: { message: 'Set OPENROUTER_API_KEY in the server environment or .env.local.' } },
			500,
		);
	}

	let body: { prompt?: unknown };
	try {
		body = (await request.json()) as { prompt?: unknown };
	} catch {
		return jsonResponse({ error: { message: 'Request body must be valid JSON.' } }, 400);
	}

	if (typeof body.prompt !== 'string' || !body.prompt.trim()) {
		return jsonResponse({ error: { message: 'Prompt must be a non-empty string.' } }, 400);
	}

	try {
		const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey.trim()}`,
			},
			body: JSON.stringify({
				model: MODEL,
				messages: [{ role: 'user', content: body.prompt }],
				temperature: 0.9,
				max_tokens: MAX_TOKENS,
			}),
		});
		const responseBody = await upstream.text();

		return new Response(responseBody, {
			status: upstream.status,
			headers: {
				'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
			},
		});
	} catch {
		return jsonResponse({ error: { message: 'Unable to reach OpenRouter.' } }, 502);
	}
}
