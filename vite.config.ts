import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig, type Plugin } from 'vite';

import { handleChatRequest } from './src/server/openrouter';

const openRouterDevApi = (): Plugin => ({
	name: 'openrouter-dev-api',
	configureServer(server) {
		server.middlewares.use('/api/chat', async (req, res) => {
			try {
				const chunks: Buffer[] = [];
				for await (const chunk of req) {
					chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
				}

				const request = new Request('http://localhost/api/chat', {
					method: req.method,
					headers: {
						'Content-Type': req.headers['content-type'] ?? 'application/json',
						...(typeof req.headers['x-openrouter-api-key'] === 'string'
							? { 'X-OpenRouter-API-Key': req.headers['x-openrouter-api-key'] }
							: {}),
					},
					body: Buffer.concat(chunks).toString('utf8'),
				});
				const response = await handleChatRequest(request);

				res.statusCode = response.status;
				response.headers.forEach((value, name) => res.setHeader(name, value));
				res.end(await response.text());
			} catch (error) {
				server.config.logger.error('Local chat endpoint failed', { error });
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ error: { message: 'Local chat endpoint failed.' } }));
			}
		});
	},
});

export default defineConfig(() => ({
	plugins: [react(), openRouterDevApi()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
}));
