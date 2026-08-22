import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import chatApi from '../api/chatApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/common/EmptyState';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { timeAgo } from '../utils/formatters';
import './MessagesPage.css';

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await chatApi.getConversations();
        setConversations(Array.isArray(data) ? data : data.content || []);
      } catch {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const selectConversation = async (conv) => {
    setActiveConversation(conv);
    setMessagesLoading(true);
    try {
      const { data } = await chatApi.getMessages(conv.id);
      setMessages(Array.isArray(data) ? data : data.content || []);
      await chatApi.markConversationRead(conv.id);
    } catch {
      toast.error('Failed to load messages.');
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const msg = newMessage;
    setNewMessage('');

    try {
      await chatApi.sendMessage(activeConversation.id, { content: msg });
      // Re-fetch messages
      const { data } = await chatApi.getMessages(activeConversation.id);
      setMessages(Array.isArray(data) ? data : data.content || []);
    } catch {
      setNewMessage(msg);
      toast.error('Failed to send message.');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="messages">
        <div className="messages__sidebar">
          <SkeletonList count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="messages">
      <div className="messages__sidebar">
        <div className="messages__sidebar-header">
          <h2>Messages</h2>
        </div>
        <div className="messages__conversation-list">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const otherUser = conv.otherUser || conv.participantName;
              const name = typeof otherUser === 'string' ? otherUser : otherUser?.fullName || 'Unknown';
              return (
                <button
                  key={conv.id}
                  className={`messages__conversation-item ${activeConversation?.id === conv.id ? 'messages__conversation-item--active' : ''}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="messages__conversation-avatar">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="messages__conversation-info">
                    <span className="messages__conversation-name">{name}</span>
                    <span className="messages__conversation-preview">
                      {conv.lastMessage || conv.foodTitle || 'Start a conversation'}
                    </span>
                  </div>
                  {conv.lastMessageTime && (
                    <span className="messages__conversation-time">
                      {timeAgo(conv.lastMessageTime)}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="No conversations yet"
              description="Start a conversation by messaging a food lister."
            />
          )}
        </div>
      </div>

      <div className="messages__chat">
        {activeConversation ? (
          <>
            <div className="messages__chat-header">
              <h3>
                {typeof (activeConversation.otherUser || activeConversation.participantName) === 'string'
                  ? activeConversation.otherUser || activeConversation.participantName
                  : activeConversation.otherUser?.fullName || 'Chat'}
              </h3>
              {activeConversation.foodTitle && (
                <span className="messages__chat-context">
                  Re: {activeConversation.foodTitle}
                </span>
              )}
            </div>

            <div className="messages__chat-body">
              {messagesLoading ? (
                <div className="messages__loading">Loading messages...</div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`messages__message ${isOwn ? 'messages__message--own' : ''}`}>
                      <div className="messages__message-content">
                        <p>{msg.content}</p>
                        <span className="messages__message-time">
                          {timeAgo(msg.createdAt || msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="messages__chat-input" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" disabled={!newMessage.trim()}>
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="messages__empty-chat">
            <MessageSquare size={48} color="var(--color-text-muted)" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
