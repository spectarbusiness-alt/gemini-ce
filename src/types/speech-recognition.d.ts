interface BrowserSpeechRecognitionResult {
	readonly 0: { readonly transcript: string };
	readonly isFinal: boolean;
	readonly length: number;
}

interface BrowserSpeechRecognitionEvent extends Event {
	readonly results: ArrayLike<BrowserSpeechRecognitionResult>;
}

interface BrowserSpeechRecognition extends EventTarget {
	lang: string;
	interimResults: boolean;
	continuous: boolean;
	onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
	onerror: ((event: { error: string }) => void) | null;
	onend: (() => void) | null;
	start(): void;
	stop(): void;
}

interface BrowserSpeechRecognitionConstructor {
	new (): BrowserSpeechRecognition;
}

interface Window {
	SpeechRecognition?: BrowserSpeechRecognitionConstructor;
	webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
}
