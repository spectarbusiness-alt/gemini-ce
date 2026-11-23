import { useCallback, useEffect, useState } from 'react';

import type { ChatTurn, OpenRouterMessage } from '@/libs/chatTypes';
import { runChat } from '@/libs/gemini';
import { ChatContext } from './ChatContext';

export const ChatContextProvider = ({ children }: React.PropsWithChildren) => {
	const [apiKey, setApiKey] = useState('');
	const [storageError, setStorageError] = useState('');
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [prevPrompts, setPrevPrompts] = useState<string[]>([]);
	const [recentPrompt, setRecentPrompt] = useState<string>('');
	const [prompt, setPrompt] = useState<string>('');
	const [recentImages, setRecentImages] = useState<string[]>([]);
	const [turns, setTurns] = useState<ChatTurn[]>([]);
	const [responseId, setResponseId] = useState<number>(0);
	const [isPending, setIsPending] = useState<boolean>(false);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [output, setOutput] = useState<string>('');
	const [showResult, setShowResult] = useState<boolean>(false);

	useEffect(() => {
		try {
			setApiKey(window.localStorage.getItem('openrouter-api-key') ?? '');
		} catch {
			setStorageError('Could not read the API key from this browser storage.');
		}
	}, []);

	const saveApiKey = useCallback((value: string) => {
		try {
			if (value) window.localStorage.setItem('openrouter-api-key', value);
			else window.localStorage.removeItem('openrouter-api-key');
			setApiKey(value);
			setStorageError('');
		} catch {
			throw new Error('Could not save the API key in this browser storage.');
		}
	}, []);
	const openSettings = useCallback(() => setIsSettingsOpen(true), []);
	const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

	const handleNewChat = () => {
		setTurns([]);
		setRecentPrompt('');
		setRecentImages([]);
		setOutput('');
		setIsError(false);
		setShowResult(false);
	};

	const handleSendPrompt = async (prompt: string, images: string[] = []) => {
		const completedTurns =
			output && !isError
				? [
						...turns,
						{ prompt: recentPrompt, images: recentImages, response: output },
					]
				: turns;
		const history: OpenRouterMessage[] = completedTurns.flatMap((turn) => {
			const content: OpenRouterMessage['content'] = turn.images.length
				? [
						{ type: 'text', text: turn.prompt || 'Analyze this image.' },
						...turn.images.map((url) => ({
							type: 'image_url' as const,
							image_url: { url },
						})),
					]
				: turn.prompt;
			return [
				{ role: 'user', content },
				{ role: 'assistant', content: turn.response },
			];
		});
		const currentContent: OpenRouterMessage['content'] = images.length
			? [
					{ type: 'text', text: prompt || 'Analyze this image.' },
					...images.map((url) => ({
						type: 'image_url' as const,
						image_url: { url },
					})),
				]
			: prompt;
		const messages = [
			...history,
			{ role: 'user' as const, content: currentContent },
		];
		let remainingImages = images.length;
		let remainingImageDataLength = images.reduce(
			(total, image) => total + image.length,
			0,
		);

		for (let index = messages.length - 2; index >= 0; index--) {
			const message = messages[index];
			if (message.role !== 'user' || typeof message.content === 'string')
				continue;

			const content = message.content.filter((part) => {
				if (part.type !== 'image_url') return true;
				if (
					remainingImages >= 4 ||
					remainingImageDataLength + part.image_url.url.length > 4_000_000
				) {
					return false;
				}
				remainingImages += 1;
				remainingImageDataLength += part.image_url.url.length;
				return true;
			}) as (typeof message.content)[number][];
			messages[index] = { ...message, content };
		}

		setResponseId((id) => id + 1);
		setIsGenerating(true);
		setIsPending(true);
		setIsError(false);
		setRecentPrompt(
			prompt.trim() || (images.length ? 'Analyze this image.' : ''),
		);
		setRecentImages(images);
		setShowResult(true);

		setPrevPrompts((prev) => [...prev.filter((p) => p !== prompt), prompt]);

		setTurns(completedTurns);
		const { data, error } = await runChat(messages, apiKey);

		if (error) {
			setOutput(error);
			setIsError(true);
			setIsPending(false);
			setIsGenerating(false);
			setShowResult(true);

			return;
		}

		setOutput(data ?? '');
		setIsPending(false);
		setPrompt('');
		setIsGenerating(false);
	};

	return (
		<ChatContext.Provider
			value={{
				sendPrompt: handleSendPrompt,
				apiKey,
				saveApiKey,
				storageError,
				isSettingsOpen,
				openSettings,
				closeSettings,
				setPrevPrompts,
				setRecentPrompt,
				setPrompt,
				startNewChat: handleNewChat,
				prevPrompts,
				recentPrompt,
				prompt,
				recentImages,
				turns,
				responseId,
				isPending,
				isGenerating,
				isError,
				output,
				showResult,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};
