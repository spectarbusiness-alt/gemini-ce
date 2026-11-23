import { createContext } from 'react';

import type { ChatTurn } from '@/libs/chatTypes';

type ChatContextProps = {
	sendPrompt: (prompt: string, images?: string[]) => Promise<void>;
	apiKey: string;
	saveApiKey: (apiKey: string) => void;
	storageError: string;
	isSettingsOpen: boolean;
	openSettings: () => void;
	closeSettings: () => void;
	setPrevPrompts: React.Dispatch<React.SetStateAction<string[]>>;
	setRecentPrompt: React.Dispatch<React.SetStateAction<string>>;
	setPrompt: React.Dispatch<React.SetStateAction<string>>;
	startNewChat: () => void;
	prevPrompts: string[];
	recentPrompt: string;
	prompt: string;
	recentImages: string[];
	turns: ChatTurn[];
	responseId: number;
	isPending: boolean;
	isGenerating: boolean;
	isError: boolean;
	output: string;
	showResult: boolean;
};

export const ChatContext = createContext<ChatContextProps>({
	sendPrompt: async () => {},
	apiKey: '',
	saveApiKey: () => {},
	storageError: '',
	isSettingsOpen: false,
	openSettings: () => {},
	closeSettings: () => {},
	setPrevPrompts: () => {},
	setRecentPrompt: () => {},
	setPrompt: () => {},
	startNewChat: () => {},
	prevPrompts: [],
	recentPrompt: '',
	prompt: '',
	recentImages: [],
	turns: [],
	responseId: 0,
	isPending: false,
	isGenerating: false,
	isError: false,
	output: '',
	showResult: false,
});
