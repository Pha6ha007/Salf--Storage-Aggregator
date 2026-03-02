'use client';

import { ChatMessage as ChatMessageType } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex items-start space-x-2 px-4 py-2',
        isUser && 'flex-row-reverse space-x-reverse',
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold',
          isUser ? 'bg-green-600' : 'bg-blue-600',
        )}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'rounded-2xl px-4 py-3 max-w-[70%] break-words',
          isUser
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-900',
        )}
      >
        {/* Message Content */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Timestamp (optional, only show on hover) */}
        <div
          className={cn(
            'text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isUser ? 'text-green-100' : 'text-gray-500',
          )}
        >
          {new Date(message.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
