'use client';

interface ChatSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
}

export function ChatSuggestions({
  suggestions,
  onSuggestionClick,
  disabled = false,
}: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="px-4 py-2 space-y-2">
      <div className="text-xs text-gray-500 font-medium">Quick replies:</div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => !disabled && onSuggestionClick(suggestion)}
            disabled={disabled}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
