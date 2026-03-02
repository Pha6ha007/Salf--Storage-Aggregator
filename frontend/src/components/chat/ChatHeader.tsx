'use client';

import { X, Minus } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export function ChatHeader({
  onClose,
  onMinimize,
  isMinimized = false,
}: ChatHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600/95 to-blue-700/95 backdrop-blur-lg text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
      {/* Title and Status */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
          AI
        </div>
        <div>
          <h3 className="font-semibold text-sm">StorageCompare Assistant</h3>
          <div className="flex items-center space-x-1.5 text-xs text-blue-100">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        {/* Minimize Button */}
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            <Minus size={18} />
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/20 rounded transition-colors"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
