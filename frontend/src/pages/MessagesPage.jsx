import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MessageSquare, Send, ArrowLeft, User, Plus, Trash2,
} from 'lucide-react';
import chatApi from '../api/chatApi';
import messageApi from '../api/messageApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { timeAgo } from '../utils/formatters';
import './MessagesPage.css';

function getStoredChats() {
  try {
    return JSON.parse(localStorage.getItem('saverfwd_chats') || '[]');
  } catch {
    return [];
  }
}

function saveStoredChats(chats) {
  localStorage.setItem('saverfwd_chats', JSON.stringify(chats));
}

export default function MessagesPage() {
  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [chats, setChats] = useState(getStoredChats);
  const [activeChatId, setActiveChatId] = useState(urlChatId ? Number(urlChatId) : null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatUserId, setNewChatUserId] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync URL param
  useEffect(() => {
    if (urlChatId) {
      setActiveChatId(Number(urlChatId));
    }
  }, [urlChatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages for active chat
  const loadMessages = useCallback(async (chatId) => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    try {
      await chatApi.getChatById(chatId);
      // The backend Chat entity doesn't expose messages directly via getChatById
      // We'll store messages locally as we send them
      // For now, load from localStorage
      const stored = JSON.parse(localStorage.getItem(`saverfwd_messages_${chatId}`) || '[]');
      setMessages(stored);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadMessages(activeChatId);
  }, [activeChatId, loadMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    setSending(true);
    try {
      const response = await messageApi.sendMessage(activeChatId, newMessage.trim());
      const msg = {
        id: response?.id || Date.now(),
        chatId: activeChatId,
        senderId: user.id,
        content: newMessage.trim(),
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => {
        const updated = [...prev, msg];
        localStorage.setItem(`saverfwd_messages_${activeChatId}`, JSON.stringify(updated));
        return updated;
      });
      setNewMessage('');
      inputRef.current?.focus();
    } catch (err) {
      toast.error(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    const userId = Number(newChatUserId);
    if (!userId || userId <= 0) {
      toast.error('Please enter a valid user ID.');
      return;
    }

    setCreatingChat(true);
    try {
      await chatApi.createChat(userId);
      // The backend doesn't return the chat ID from createChat (returns void)
      // We'll use a temporary approach - store by userId
      const tempChat = { id: Date.now(), userId, createdAt: new Date().toISOString() };
      const updatedChats = [...chats, tempChat];
      setChats(updatedChats);
      saveStoredChats(updatedChats);
      setActiveChatId(tempChat.id);
      setShowNewChat(false);
      setNewChatUserId('');
      toast.success('Chat created!');
    } catch (err) {
      toast.error(err.message || 'Failed to create chat.');
    } finally {
      setCreatingChat(false);
    }
  };

  const handleDeleteChat = (chatId) => {
    const updated = chats.filter((c) => c.id !== chatId);
    setChats(updated);
    saveStoredChats(updated);
    localStorage.removeItem(`saverfwd_messages_${chatId}`);
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([]);
    }
    toast.success('Chat removed.');
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="messages">
      {/* Sidebar: Chat list */}
      <div className={`messages__sidebar ${activeChatId ? 'messages__sidebar--hidden-mobile' : ''}`}>
        <div className="messages__sidebar-header">
          <h2>Messages</h2>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => setShowNewChat(!showNewChat)}
          >
            <Plus size={18} />
          </button>
        </div>

        {showNewChat && (
          <form className="messages__new-chat" onSubmit={handleCreateChat}>
            <input
              type="number"
              placeholder="Enter user ID to chat with"
              value={newChatUserId}
              onChange={(e) => setNewChatUserId(e.target.value)}
              className="messages__new-chat-input"
              min="1"
            />
            <button
              type="submit"
              className="btn btn--primary btn--sm"
              disabled={creatingChat}
            >
              {creatingChat ? 'Creating...' : 'Start'}
            </button>
          </form>
        )}

        {chats.length > 0 ? (
          <div className="messages__chat-list">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`messages__chat-item ${activeChatId === chat.id ? 'messages__chat-item--active' : ''}`}
                onClick={() => {
                  setActiveChatId(chat.id);
                  navigate(`/messages/${chat.id}`, { replace: true });
                }}
              >
                <div className="messages__chat-avatar">
                  <User size={20} />
                </div>
                <div className="messages__chat-info">
                  <span className="messages__chat-name">User #{chat.userId}</span>
                  <span className="messages__chat-preview">Tap to open</span>
                </div>
                <button
                  className="messages__chat-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                  title="Remove chat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="messages__sidebar-empty">
            <p>No conversations yet</p>
            <p className="messages__sidebar-hint">
              Start a chat from a food listing, or click + to enter a user ID.
            </p>
          </div>
        )}
      </div>

      {/* Main: Chat window */}
      <div className={`messages__main ${!activeChatId ? 'messages__main--empty' : ''}`}>
        {activeChatId ? (
          <>
            <div className="messages__chat-header">
              <button
                className="messages__back-btn"
                onClick={() => {
                  setActiveChatId(null);
                  navigate('/messages', { replace: true });
                }}
              >
                <ArrowLeft size={20} />
              </button>
              <div className="messages__chat-header-info">
                <span className="messages__chat-header-name">
                  {activeChat ? `User #${activeChat.userId}` : `Chat #${activeChatId}`}
                </span>
              </div>
            </div>

            <div className="messages__chat-window">
              {loadingMessages ? (
                <div className="messages__loading">
                  <SkeletonList count={3} />
                </div>
              ) : messages.length > 0 ? (
                <div className="messages__message-list">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`messages__message ${isMe ? 'messages__message--me' : 'messages__message--them'}`}
                      >
                        <div className="messages__bubble">
                          <p className="messages__bubble-text">{msg.content}</p>
                          <span className="messages__bubble-time">
                            {timeAgo(msg.createdAt)}
                            {isMe && msg.isRead && <span className="messages__read-check"> ✓</span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="messages__empty-chat">
                  <MessageSquare size={32} strokeWidth={1.5} />
                  <p>No messages yet</p>
                  <span>Send a message to start the conversation</span>
                </div>
              )}
            </div>

            <form className="messages__input-bar" onSubmit={handleSendMessage}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="messages__input"
                maxLength={2000}
                disabled={sending}
              />
              <button
                type="submit"
                className="messages__send-btn"
                disabled={!newMessage.trim() || sending}
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="messages__placeholder">
            <MessageSquare size={48} strokeWidth={1.5} />
            <h3>Select a conversation</h3>
            <p>Choose a chat from the sidebar or start a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
