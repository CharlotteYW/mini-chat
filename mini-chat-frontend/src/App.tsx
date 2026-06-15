import { useState, useEffect } from 'react'
import type { Message, ModelOption, Conversation} from './types/chat';
import { MODEL_OPTIONS } from './types/chat';
import { MessageList } from './components/MessageList';
import { InputBar } from './components/InputBar';
import { Sidebar } from './components/Sidebar';

import './App.css';

const API_URL = import.meta.env.VITE_API_URL ;

// function getSessionId(): string {
//   let sid = localStorage.getItem('session_id')
//   if(!sid){
//     sid = crypto.randomUUID()
//     localStorage.setItem('session_id', sid)
//   }
//   return sid
// }

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState<ModelOption>(MODEL_OPTIONS[0])
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
    // const [sessionId, setSessionId] = useState<string>('')
    
    // function newChat(){
    //   const sid = crypto.randomUUID()
    //   localStorage.setItem('session_id', sid)
    //   setSessionId(sid)
    //   setCurrentConversationId(null)
    //   setMessages([])
    // }
    useEffect(() => {
      loadconversations()
    }, [])

    // async function saveMessage(role: string, content:string){
    //   await fetch(`${API_URL}/api/messages`,{
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({session_id:sessionId, role, content})
    //   })
    // }
    async function loadconversations(){
      try {
        const res = await fetch(`${API_URL}/api/conversations`)
        const data = await res.json()
        setConversations(data)
        if (data.length > 0) loadconversation(data[0].id)
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    }
  async function loadconversation(id: string){
    setCurrentConversationId(id)
    const res = await fetch(`${API_URL}/api/messages/${id}`)
    const data = await res.json()
    setMessages(data.map((m: {id: string; role: string; content: string}) =>({
      id:m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content
    })))
  }
  function newChat(){
    setCurrentConversationId(null)
    setMessages([])
  }

    async function sendMessage(content: string) { 

        let convId = currentConversationId
        if (!convId){
          const title = content.length > 30? content.slice(0,30) + '...' : content
          const res = await fetch(`${API_URL}/api/conversations`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title}),  
            });
          const newConv = await res.json()
          convId = newConv.id
          setCurrentConversationId(convId)
          setConversations(prev =>[newConv, ...prev])

        }
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content
        };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setLoading(true);

        const assistantId =(Date.now() + 1).toString();
        setMessages(prev => [...prev, {
          id: assistantId, 
          role: 'assistant', 
          content: ''
        }]);

        let finalContent = ''

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
                  finalContent += chunk
                  setMessages(prev => prev.map(m =>
                     m.id === assistantId 
                     ? {...m, content: m.content + chunk} : 
                     m
                  ));
                }
            } else {
                throw new Error('No response body received');
            }

            // await saveMessage('user', content)
            // await saveMessage('assistant', finalContent)
            await fetch(`${API_URL}/api/messages`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  session_id: convId, role: 'user', content
                }),  
            });

            await fetch(`${API_URL}/api/messages`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  session_id: convId, role: 'assistant', content: finalContent
                }),  
            });
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
          <Sidebar
            conversations={conversations}
            currentId={currentConversationId}
            onSelect={loadconversation}
            onNew={newChat}
          />
          <div className='main'>
          <header className="header">
            <h1>Mini Chat</h1>
            {/* <button onClick={newChat} className="new-chat-btn" disabled={loading}>
              New Chat
            </button> */}
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
        </div>
    );
}
             