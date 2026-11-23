import { Eye, EyeOff, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

import { ChatContext } from '@/providers/ChatContext';

const SettingsDialog = () => {
	const {
		apiKey,
		saveApiKey,
		storageError,
		isSettingsOpen,
		closeSettings,
	} = useContext(ChatContext);
	const [draft, setDraft] = useState(apiKey);
	const [isVisible, setIsVisible] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (isSettingsOpen) {
			setDraft(apiKey);
			setError('');
		}
	}, [apiKey, isSettingsOpen]);

	useEffect(() => {
		if (!isSettingsOpen) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeSettings();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [closeSettings, isSettingsOpen]);

	if (!isSettingsOpen) return null;

	const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			saveApiKey(draft.trim());
			closeSettings();
		} catch (saveError) {
			setError(
				saveError instanceof Error
					? saveError.message
					: 'Could not save your API key.',
			);
		}
	};

	const handleRemove = () => {
		try {
			saveApiKey('');
			setDraft('');
			setError('');
		} catch (saveError) {
			setError(
				saveError instanceof Error
					? saveError.message
					: 'Could not remove your API key.',
			);
		}
	};

	return (
		<div
			className='fixed inset-0 z-50 grid place-items-center bg-black/40 px-4'
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) closeSettings();
			}}
		>
			<section
				role='dialog'
				aria-modal='true'
				aria-labelledby='settings-title'
				className='w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl'
			>
				<div className='mb-5 flex items-center justify-between'>
					<h2 id='settings-title' className='text-xl font-medium'>
						Settings
					</h2>
					<button
						type='button'
						onClick={closeSettings}
						className='rounded-full p-2 text-brand-300 hover:bg-brand-100'
						aria-label='Close settings'
					>
						<X size={18} />
					</button>
				</div>

				<form onSubmit={handleSave}>
					<label htmlFor='openrouter-api-key' className='mb-2 block text-sm'>
						OpenRouter API key
					</label>
					<div className='flex items-center gap-2 rounded-xl border border-brand-200 px-3'>
						<input
							id='openrouter-api-key'
							type={isVisible ? 'text' : 'password'}
							autoComplete='off'
							spellCheck={false}
							value={draft}
							onChange={(event) => setDraft(event.target.value)}
							placeholder='Paste your OpenRouter API key'
							className='min-w-0 flex-1 border-none bg-transparent py-3 outline-none'
						/>
						<button
							type='button'
							onClick={() => setIsVisible((visible) => !visible)}
							className='rounded-md p-2 text-brand-300 hover:bg-brand-100'
							aria-label={isVisible ? 'Hide API key' : 'Show API key'}
						>
							{isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
						</button>
					</div>

					<p className='mt-3 text-sm text-brand-300'>
						Get a key from{' '}
						<a
							href='https://openrouter.ai/keys'
							target='_blank'
							rel='noreferrer'
							className='text-blue-600 underline'
						>
							OpenRouter
						</a>
						. It is saved in this browser and sent to this app’s server when you
						chat, then forwarded to OpenRouter. Only use this app with a server
						you trust.
					</p>

					{storageError && (
						<p role='alert' className='mt-3 text-sm text-red-500'>
							{storageError}
						</p>
					)}
					{error && (
						<p role='alert' className='mt-3 text-sm text-red-500'>
							{error}
						</p>
					)}

					<div className='mt-6 flex justify-between gap-3'>
						<button
							type='button'
							onClick={handleRemove}
							disabled={!apiKey && !draft}
							className='rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50'
						>
							Remove key
						</button>
						<div className='flex gap-3'>
							<button
								type='button'
								onClick={closeSettings}
								className='rounded-lg px-4 py-2 text-sm hover:bg-brand-100'
							>
								Cancel
							</button>
							<button
								type='submit'
								disabled={!draft.trim()}
								className='rounded-lg bg-brand-400 px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50'
							>
								Save key
							</button>
						</div>
					</div>
				</form>
			</section>
		</div>
	);
};

export default SettingsDialog;
