// Chat Types for Web Chat Widget

export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatIntent =
  | 'search_warehouse'
  | 'size_recommendation'
  | 'price_inquiry'
  | 'booking_help'
  | 'operator_contact'
  | 'complaint'
  | 'faq'
  | 'general';

export type ChatChannel = 'whatsapp' | 'web';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  created_at: string;
  intent?: ChatIntent;
  confidence?: number;
}

export interface ChatWarehouse {
  id: number;
  name?: string;
  district?: string;
  price?: number;
  rating?: number;
  link?: string;
}

export interface ChatSession {
  id: string;
  channel: ChatChannel;
  created_at: string;
}

export interface PageContext {
  path: string;
  warehouseId?: string | null;
  searchParams?: Record<string, string | string[] | undefined>;
  referrer?: string;
  city?: string;
}

// API Request/Response Types

export interface SendMessageRequest {
  session_id: string;
  message: string;
  channel?: string;
  page_context?: PageContext;
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    reply: string;
    intent: ChatIntent;
    confidence: number;
    suggestions?: string[];
    warehouses?: ChatWarehouse[];
    session_id: string;
  };
}

export interface GetHistoryResponse {
  success: boolean;
  data: {
    session: ChatSession;
    messages: ChatMessage[];
  };
}

// UI State Types

export interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  sessionId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  unreadCount: number;
  suggestions: string[];
  warehouses: ChatWarehouse[];
}

export interface ChatActions {
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearError: () => void;
  markAsRead: () => void;
}
