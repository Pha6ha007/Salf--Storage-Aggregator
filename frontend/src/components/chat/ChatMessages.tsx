'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType, ChatWarehouse } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import { ChatWarehouseCard } from './ChatWarehouseCard';
import { Loader2 } from 'lucide-react';

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  isTyping?: boolean;
  warehouses?: ChatWarehouse[];
  error?: string | null;
}

export function ChatMessages({
  messages,
  isLoading = false,
  isTyping = false,
  warehouses = [],
  error = null,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-white"
      style={{ maxHeight: 'calc(100% - 140px)' }}
    >
      {/* Loading State */}
      {isLoading && messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-2 text-gray-500">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-sm">Loading chat...</p>
          </div>
        </div>
      )}

      {/* Messages */}
      {!isLoading && messages.length > 0 && (
        <div className="py-4 space-y-1">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          {isTyping && <ChatTypingIndicator />}

          {/* Warehouse Cards (if any) */}
          {warehouses.length > 0 && (
            <div className="mt-2 space-y-2">
              {warehouses.map((warehouse) => (
                <ChatWarehouseCard key={warehouse.id} warehouse={warehouse} />
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500 px-6">
            <p className="text-sm">Start a conversation</p>
            <p className="text-xs mt-1">Ask me anything about storage!</p>
          </div>
        </div>
      )}

      {/* Scroll Anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
