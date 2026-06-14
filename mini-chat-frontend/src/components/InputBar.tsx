import { useState,type KeyboardEvent } from 'react';

interface Props {
    onSend: (content: string) => void;
    disabled: boolean;
}

export function InputBar({onSend, disabled}: Props) {
    const [input, setInput] = useState('');

    function handleSend() {
        if (!input.trim()|| disabled) return;
        onSend(input.trim());
        setInput('');
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="input-bar">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={disabled}
                rows={1}
            />
            <button onClick={handleSend} disabled={disabled || !input.trim()}>
                {disabled ? 'Loading...' : 'Send'}
            </button>
        </div>
    );
}