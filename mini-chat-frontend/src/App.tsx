import { useState } from 'react'
import type { Message } from './types/chat';
import { MessageList } from './components/MessageList';
import { InputBar } from './components/InputBar';
import './App.css';

const API_URL = 'http://localhost:8000';

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    
    async function sendMessage(content: string) { 
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content
        };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setLoading(true);

        const assistantId =(Date.now() + 1).toString();
        setMessages(prev => [...prev, {id: assistantId, role: 'assistant', content: ''}]);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  messages: updatedMessages.map(m => ({role: m.role, content: m.content})),
                  model: 'llama3.1:8b'
                }),  
            })

            const reader = response.body!.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
              const{ done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value);

              setMessages(prev => prev.map(m =>
                 m.id === assistantId 
                 ? {...m, content: m.content + chunk} : 
                 m
              ));
            }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
    }

    return (
        <div className="app">
          <header className="header">
            <h1>Mini Chat</h1>
            <span className="model-badge">Model: llama3.1:8b</span>
          </header>
            <MessageList messages={messages} />
            <InputBar onSend={sendMessage} disabled={loading} />
        </div>
    );
}
             