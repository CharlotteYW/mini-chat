import type { Message } from '../types/chat';

export function MessageBubble({message}: {message: Message}) {
    const isUser = message.role === 'user';
    return (
        <div className={`message ${isUser ? 'user' : 'assistant'}`}>
            <div className="bubble">
                {message.content || <span className="cursor">|</span>}
            </div>
        </div>
    );
}