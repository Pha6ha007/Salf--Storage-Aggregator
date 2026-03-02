'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChatMessage, ChatState, ChatActions, ChatWarehouse } from '@/types/chat';
import {
  sendChatMessage,
  getChatHistory,
  generateSessionId,
  getPageContext,
} from '@/lib/api/chat';

const SESSION_STORAGE_KEY = 'chat_session_id';
const OPEN_STATE_KEY = 'chat_is_open';

export function useChatSession(): ChatState & ChatActions {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [warehouses, setWarehouses] = useState<ChatWarehouse[]>([]);

  const hasLoadedHistory = useRef(false);

  // Initialize session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Restore session ID from localStorage
    const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Generate new session ID
      const newSessionId = generateSessionId();
      localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
      setSessionId(newSessionId);
    }

    // Restore open state
    const wasOpen = sessionStorage.getItem(OPEN_STATE_KEY) === 'true';
    setIsOpen(wasOpen);
  }, []);

  // Define loadHistory before it's used in useEffect
  const loadHistory = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getChatHistory(sessionId);
      setMessages(response.data.messages);

      // Add greeting if no messages
      if (response.data.messages.length === 0) {
        const greetingMessage: ChatMessage = {
          id: `greeting_${Date.now()}`,
          role: 'assistant',
          content: 'Hi! Looking for storage in the UAE? I can help you find the perfect warehouse!',
          created_at: new Date().toISOString(),
        };
        setMessages([greetingMessage]);

        // Default suggestions
        setSuggestions([
          'Find storage near me',
          'What sizes do you have?',
          'Show me prices',
        ]);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Load chat history when session is ready
  useEffect(() => {
    if (sessionId && !hasLoadedHistory.current) {
      loadHistory();
      hasLoadedHistory.current = true;
    }
  }, [sessionId, loadHistory]);

  // Track unread messages when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setUnreadCount((prev) => prev + 1);
      }
    }
  }, [messages, isOpen]);

  // Persist open state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(OPEN_STATE_KEY, isOpen.toString());
    }
  }, [isOpen]);

  // Actions
  const openChat = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
    setIsMinimized(false);
    if (!isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const minimizeChat = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!sessionId || !message.trim()) return;

      setError(null);
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: message.trim(),
        created_at: new Date().toISOString(),
      };

      // Optimistic update
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setSuggestions([]); // Clear suggestions while processing

      try {
        const pageContext = getPageContext();
        const response = await sendChatMessage(sessionId, message, pageContext);

        const assistantMessage: ChatMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: response.data.reply,
          created_at: new Date().toISOString(),
          intent: response.data.intent,
          confidence: response.data.confidence,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSuggestions(response.data.suggestions || []);
        setWarehouses(response.data.warehouses || []);

        // Update session ID if changed
        if (response.data.session_id !== sessionId) {
          setSessionId(response.data.session_id);
          localStorage.setItem(SESSION_STORAGE_KEY, response.data.session_id);
        }
      } catch (err) {
        console.error('Failed to send message:', err);
        setError(err instanceof Error ? err.message : 'Failed to send message');

        // Remove optimistic user message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      } finally {
        setIsTyping(false);
      }
    },
    [sessionId],
  );

  return {
    // State
    isOpen,
    isMinimized,
    sessionId,
    messages,
    isLoading,
    isTyping,
    error,
    unreadCount,
    suggestions,
    warehouses,

    // Actions
    openChat,
    closeChat,
    toggleChat,
    minimizeChat,
    sendMessage,
    loadHistory,
    clearError,
    markAsRead,
  };
}
