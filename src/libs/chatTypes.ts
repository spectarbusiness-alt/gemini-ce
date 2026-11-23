export type OpenRouterImagePart = {
	type: 'image_url';
	image_url: { url: string };
};

export type OpenRouterTextPart = {
	type: 'text';
	text: string;
};

export type OpenRouterMessage = {
	role: 'user' | 'assistant';
	content: string | (OpenRouterTextPart | OpenRouterImagePart)[];
};

export type ChatTurn = {
	prompt: string;
	images: string[];
	response: string;
};
