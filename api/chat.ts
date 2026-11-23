import { handleChatRequest } from '../src/server/openrouter';

export default function handler(request: Request): Promise<Response> {
	return handleChatRequest(request, process.env.OPENROUTER_API_KEY);
}
