import type { Conversation } from "../types/chat";

interface Props {
    conversations: Conversation[]
    currentId: string | null
    onSelect: (id: string) => void
    onNew: () => void
}

export function Sidebar({conversations, currentId, onSelect, onNew}: Props){
    return(
        <div className="sidebar">
            <button className="new-chat-btn" onClick={onNew}>
                + New Chat
            </button>
            <div className="conversation-list">
                {conversations.map(conv => (
                    <div
                     key={conv.id}
                     className={`conversation-item ${conv.id === currentId ? 'active' : ''}`}
                     onClick={() => onSelect(conv.id)}
                     >
                        {conv.title}
                    </div>
                ))}
            </div>
        </div>
    )
}