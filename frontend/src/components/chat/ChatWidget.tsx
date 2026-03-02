'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Restore open state from sessionStorage
    const wasOpen = sessionStorage.getItem('chat_is_open') === 'true';
    setIsOpen(wasOpen);
  }, []);

  // Persist open state
  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem('chat_is_open', isOpen.toString());
    }
  }, [isOpen, mounted]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setUnreadCount(0); // Clear unread when opening
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!mounted) {
    // Prevent SSR hydration mismatch
    return null;
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && <ChatWindow onClose={handleClose} />}

      {/* Chat Bubble Button */}
      <button
        onClick={handleToggle}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50',
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-blue-600 hover:bg-blue-700',
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}

        {/* Unread Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Pulse Animation (when closed) */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75"></span>
        )}
      </button>
    </>
  );
}
