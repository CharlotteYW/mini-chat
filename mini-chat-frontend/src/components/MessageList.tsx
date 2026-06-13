import {useEffect, useRef} from 'react';
import type {Message} from '../types/chat';
import {MessageBubble} from './MessageBubble';

export function MessageList({messages}: {messages: Message[]}) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);
    
    return (    
        <div className="message-list">
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}