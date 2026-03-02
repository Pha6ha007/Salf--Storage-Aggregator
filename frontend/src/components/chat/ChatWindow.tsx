'use client';

import { useState } from 'react';
import { useChatSession } from '@/hooks/useChatSession';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatSuggestions } from './ChatSuggestions';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  onClose: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const chat = useChatSession();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  const handleSendMessage = async (message: string) => {
    try {
      await chat.sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div
      className={cn(
        'fixed bottom-20 right-6 w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 z-50 animate-scale-in',
        isMinimized ? 'h-[60px]' : 'h-[550px]',
      )}
    >
      {/* Header */}
      <ChatHeader
        onClose={onClose}
        onMinimize={handleMinimize}
        isMinimized={isMinimized}
      />

      {/* Chat Content (hidden when minimized) */}
      {!isMinimized && (
        <>
          {/* Messages Area */}
          <ChatMessages
            messages={chat.messages}
            isLoading={chat.isLoading}
            isTyping={chat.isTyping}
            warehouses={chat.warehouses}
            error={chat.error}
          />

          {/* Quick Reply Suggestions */}
          <ChatSuggestions
            suggestions={chat.suggestions}
            onSuggestionClick={handleSuggestionClick}
            disabled={chat.isLoading || chat.isTyping}
          />

          {/* Input Area */}
          <ChatInput
            onSend={handleSendMessage}
            disabled={chat.isLoading || chat.isTyping}
            placeholder="Ask about storage..."
          />
        </>
      )}
    </div>
  );
}
