import type { IncomingMessage, ServerResponse } from 'node:http';

import { handleChatRequest } from '../src/server/openrouter';

type VercelRequest = IncomingMessage & { body?: unknown };

const readBody = async (request: VercelRequest): Promise<string> => {
	if (request.body !== undefined) {
		return typeof request.body === 'string'
			? request.body
			: JSON.stringify(request.body);
	}

	const chunks: Buffer[] = [];
	for await (const chunk of request) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}
	return Buffer.concat(chunks).toString('utf8');
};

export default async function handler(
	request: VercelRequest,
	response: ServerResponse,
): Promise<void> {
	try {
		const method = request.method ?? 'POST';
		const body =
			method === 'GET' || method === 'HEAD'
				? undefined
				: await readBody(request);
		const apiKey = request.headers['x-openrouter-api-key'];
		const headers = {
			'Content-Type': request.headers['content-type'] ?? 'application/json',
			...(typeof apiKey === 'string'
				? { 'X-OpenRouter-API-Key': apiKey }
				: {}),
		};

		const apiRequest = new Request(
			new URL(
				request.url ?? '/api/chat',
				`https://${request.headers.host ?? 'localhost'}`,
			),
			{ method, headers, body },
		);
		const apiResponse = await handleChatRequest(apiRequest);

		response.statusCode = apiResponse.status;
		apiResponse.headers.forEach((value, name) =>
			response.setHeader(name, value),
		);
		response.end(await apiResponse.text());
	} catch (error) {
		console.error('Vercel chat function failed', error);
		response.statusCode = 500;
		response.setHeader('Content-Type', 'application/json');
		response.end(
			JSON.stringify({
				error: { message: 'The chat service failed to start.' },
			}),
		);
	}
}
