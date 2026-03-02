// Chat API Client

import type {
  SendMessageRequest,
  SendMessageResponse,
  GetHistoryResponse,
  PageContext,
} from '@/types/chat';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

/**
 * Send chat message to backend
 */
export async function sendChatMessage(
  sessionId: string,
  message: string,
  pageContext?: PageContext,
): Promise<SendMessageResponse> {
  const response = await fetch(`${API_BASE}${API_PREFIX}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for auth
    body: JSON.stringify({
      session_id: sessionId,
      message,
      channel: 'web',
      page_context: pageContext,
    } as SendMessageRequest),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    // Rate limit error
    if (response.status === 429) {
      const retryAfter = error?.retryAfter || 3600;
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      );
    }

    throw new Error(error?.message || 'Failed to send message');
  }

  return response.json();
}

/**
 * Get chat history for session
 */
export async function getChatHistory(
  sessionId: string,
  limit: number = 50,
): Promise<GetHistoryResponse> {
  const response = await fetch(
    `${API_BASE}${API_PREFIX}/chat/history?session_id=${sessionId}&limit=${limit}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    if (response.status === 404) {
      // Session not found - return empty history
      return {
        success: true,
        data: {
          session: {
            id: sessionId,
            channel: 'web',
            created_at: new Date().toISOString(),
          },
          messages: [],
        },
      };
    }

    throw new Error(error?.message || 'Failed to load history');
  }

  return response.json();
}

/**
 * Generate unique session ID for new chat
 */
export function generateSessionId(): string {
  // Use timestamp + random string for uniqueness
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `web_${timestamp}_${randomStr}`;
}

/**
 * Get current page context for chat
 */
export function getPageContext(): PageContext {
  if (typeof window === 'undefined') return { path: '/' };

  return {
    path: window.location.pathname,
    searchParams: Object.fromEntries(new URLSearchParams(window.location.search)),
    referrer: document.referrer || undefined,
  };
}
