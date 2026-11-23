import { createContext, useState } from 'react';

import { runChat } from '@/libs/gemini';

type ChatContextProps = {
	sendPrompt: (prompt: string) => Promise<void>;
	setPrevPrompts: React.Dispatch<React.SetStateAction<string[]>>;
	setRecentPrompt: React.Dispatch<React.SetStateAction<string>>;
	setPrompt: React.Dispatch<React.SetStateAction<string>>;
	startNewChat: () => void;
	prevPrompts: string[];
	recentPrompt: string;
	prompt: string;
	responseId: number;
	isPending: boolean;
	isGenerating: boolean;
	isError: boolean;
	output: string;
	showResult: boolean;
};

export const ChatContext = createContext<ChatContextProps>({
	sendPrompt: async () => {},
	setPrevPrompts: () => {},
	setRecentPrompt: () => {},
	setPrompt: () => {},
	startNewChat: () => {},
	prevPrompts: [],
	recentPrompt: '',
	prompt: '',
	responseId: 0,
	isPending: false,
	isGenerating: false,
	isError: false,
	output: '',
	showResult: false,
});

export const ChatContextProvider = ({ children }: React.PropsWithChildren) => {
	const [prevPrompts, setPrevPrompts] = useState<string[]>([]);
	const [recentPrompt, setRecentPrompt] = useState<string>('');
	const [prompt, setPrompt] = useState<string>('');
	const [responseId, setResponseId] = useState<number>(0);
	const [isPending, setIsPending] = useState<boolean>(false);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [output, setOutput] = useState<string>('');
	const [showResult, setShowResult] = useState<boolean>(false);

	const handleNewChat = () => {
		setRecentPrompt('');
		setOutput('');
		setIsError(false);
		setShowResult(false);
	};

	const handleSendPrompt = async (prompt: string) => {
		setResponseId((id) => id + 1);
		setIsGenerating(true);
		setIsPending(true);
		setIsError(false);
		setRecentPrompt(prompt);
		setShowResult(true);

		setPrevPrompts((prev) => [...prev.filter((p) => p !== prompt), prompt]);

		const { data, error } = await runChat(prompt);

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
				setPrevPrompts,
				setRecentPrompt,
				setPrompt,
				startNewChat: handleNewChat,
				prevPrompts,
				recentPrompt,
				prompt,
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
