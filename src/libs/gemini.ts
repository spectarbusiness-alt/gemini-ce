import type { OpenRouterMessage } from './chatTypes';

type OpenRouterResponse = {
	choices?: { message?: { content?: string } }[];
	error?: { message?: string };
};

export async function runChat(
	messages: OpenRouterMessage[],
): Promise<{ data?: string; error?: string }> {
	try {
		const res = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages }),
		});
		const body = await res.text();
		let json: OpenRouterResponse;
		try {
			json = JSON.parse(body) as OpenRouterResponse;
		} catch {
			return {
				error: `The chat service returned an invalid response (HTTP ${res.status}). Check the Vercel function logs and confirm OPENROUTER_API_KEY is configured.`,
			};
		}

		if (!res.ok) {
			return { error: json.error?.message ?? 'Chat request failed' };
		}

		const text = json.choices?.[0]?.message?.content;
		return text
			? { data: text }
			: { error: 'OpenRouter returned an empty response.' };
	} catch (error) {
		return { error: (error as Error).message };
	}
}
