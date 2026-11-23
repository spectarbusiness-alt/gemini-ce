type OpenRouterResponse = {
	choices?: { message?: { content?: string } }[];
	error?: { message?: string };
};

export async function runChat(prompt: string): Promise<{ data?: string; error?: string }> {
	try {
		const res = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt }),
		});
		const json = (await res.json()) as OpenRouterResponse;

		if (!res.ok) {
			return { error: json.error?.message ?? 'Chat request failed' };
		}

		const text = json.choices?.[0]?.message?.content;
		return text ? { data: text } : { error: 'OpenRouter returned an empty response.' };
	} catch (error) {
		return { error: (error as Error).message };
	}
}
