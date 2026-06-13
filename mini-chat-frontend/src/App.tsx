import { useState } from 'react'
import type { Message, ModelOption } from './types/chat';
import { MODEL_OPTIONS } from './types/chat';
import { MessageList } from './components/MessageList';
import { InputBar } from './components/InputBar';
import './App.css';

const API_URL = 'http://localhost:8000';

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState<ModelOption>(MODEL_OPTIONS[0])
    
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
                  model: selectedModel.model,
                  provider:selectedModel.provider
                }),  
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (response.body) {
                const reader = response.body.getReader();
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
            } else {
                throw new Error('No response body received');
            }
        } catch (error: any) {
          console.error('Error:', error);
          // Show error message in chat
          setMessages(prev => prev.map(m => 
            m.id === assistantId 
            ? {...m, content: `Error: ${error.message || 'Failed to get response'}`} 
            : m
          ));
        } finally {
          setLoading(false);
        }
    }

    return (
        <div className="app">
          <header className="header">
            <h1>Mini Chat</h1>
            <select
              value={selectedModel.model}
              onChange={e => setSelectedModel(MODEL_OPTIONS.find(m=>m.model == e.target.value)!
            )}
            disabled={loading}
            className="model-select"
            >
              {MODEL_OPTIONS.map(m => (<option key={m.model} value={m.model}> {m.label}</option>))}
            </select>
          </header>
            <MessageList messages={messages} />
            <InputBar onSend={sendMessage} disabled={loading} />
        </div>
    );
}
             