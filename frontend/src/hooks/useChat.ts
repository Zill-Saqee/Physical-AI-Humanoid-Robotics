/**
 * useChat Hook
 * Feature: 002-rag-chatbot
 *
 * Manages chat state, API calls, and streaming responses.
 * Supports text selection for contextual Q&A.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  UseChatResult,
  Conversation,
  Message,
  SourceReference,
} from '../types/chat';
import { DEFAULT_CHAT_CONFIG, CHAT_STORAGE_KEYS } from '../types/chat';

// Create an empty conversation
function createEmptyConversation(): Conversation {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    messages: [],
    createdAt: now,
    lastActivityAt: now,
  };
}

// Load conversation from sessionStorage
function loadConversation(): Conversation {
  if (typeof window === 'undefined') {
    return createEmptyConversation();
  }

  try {
    const stored = sessionStorage.getItem(CHAT_STORAGE_KEYS.CONVERSATION);
    if (stored) {
      return JSON.parse(stored) as Conversation;
    }
  } catch (e) {
    console.warn('Failed to load conversation from storage:', e);
  }

  return createEmptyConversation();
}

// Save conversation to sessionStorage
function saveConversation(conversation: Conversation): void {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(
        CHAT_STORAGE_KEYS.CONVERSATION,
        JSON.stringify(conversation)
      );
    } catch (e) {
      console.warn('Failed to save conversation to storage:', e);
    }
  }
}

export function useChat(): UseChatResult {
  const [conversation, setConversation] = useState<Conversation>(
    createEmptyConversation
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const lastRequestTime = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load from storage on mount
  useEffect(() => {
    setConversation(loadConversation());
  }, []);

  // Save to storage when conversation changes
  useEffect(() => {
    if (conversation.messages.length > 0) {
      saveConversation(conversation);
    }
  }, [conversation]);

  const addMessage = useCallback(
    (
      role: 'user' | 'assistant',
      content: string,
      sources?: SourceReference[]
    ) => {
      const message: Message = {
        id: uuidv4(),
        role,
        content,
        timestamp: new Date().toISOString(),
        sources,
      };

      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
        lastActivityAt: message.timestamp,
      }));

      return message;
    },
    []
  );

  const updateLastMessage = useCallback(
    (content: string, sources?: SourceReference[]) => {
      setConversation((prev) => {
        const messages = [...prev.messages];
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          messages[messages.length - 1] = {
            ...lastMessage,
            content,
            sources: sources || lastMessage.sources,
          };
        }
        return { ...prev, messages };
      });
    },
    []
  );

  const sendMessage = useCallback(
    async (query: string, textSelection?: string): Promise<void> => {
      // Rate limiting
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;
      if (timeSinceLastRequest < DEFAULT_CHAT_CONFIG.rateLimitMs) {
        setError('Please wait a moment before sending another message.');
        return;
      }

      // Validate query
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setError('Please enter a question.');
        return;
      }

      if (trimmedQuery.length > DEFAULT_CHAT_CONFIG.maxQueryLength) {
        setError(
          `Question is too long (max ${DEFAULT_CHAT_CONFIG.maxQueryLength} characters).`
        );
        return;
      }

      // Clear previous error
      setError(null);
      setIsLoading(true);
      lastRequestTime.current = now;

      // Use passed text selection or current state
      const contextText = textSelection || selectedText;

      // Add user message (include context indicator if selected text)
      const displayQuery = contextText
        ? `[About selected text] ${trimmedQuery}`
        : trimmedQuery;
      addMessage('user', displayQuery);

      // Create placeholder assistant message
      const assistantMessage = addMessage('assistant', '');

      // Abort any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        // Prepare request body
        const contextMessages = conversation.messages.slice(
          -DEFAULT_CHAT_CONFIG.maxContextMessages
        );

        const response = await fetch(DEFAULT_CHAT_CONFIG.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: trimmedQuery,
            conversationHistory: contextMessages,
            selectedText: contextText || undefined,
            conversationId: conversation.id,
            messageId: assistantMessage.id,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        // Handle SSE streaming
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let accumulatedContent = '';
        let sources: SourceReference[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'token') {
                  accumulatedContent += data.content;
                  updateLastMessage(accumulatedContent);
                } else if (data.type === 'sources') {
                  sources = data.sources || data.citations || [];
                  updateLastMessage(accumulatedContent, sources);
                } else if (data.type === 'error') {
                  throw new Error(data.message || 'An error occurred');
                }
              } catch {
                // Ignore JSON parse errors for incomplete chunks
              }
            }
          }
        }

        // Clear selected text after successful send
        setSelectedText(null);
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          // Request was cancelled, don't show error
          return;
        }

        const errorMessage =
          e instanceof Error ? e.message : 'An error occurred';
        setError(errorMessage);

        // Remove the empty assistant message on error
        setConversation((prev) => ({
          ...prev,
          messages: prev.messages.slice(0, -1),
        }));
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [conversation, selectedText, addMessage, updateLastMessage]
  );

  const retryLastMessage = useCallback(async (): Promise<void> => {
    // Find the last user message
    const messages = conversation.messages;
    let lastUserMessageIndex = -1;

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessageIndex = i;
        break;
      }
    }

    if (lastUserMessageIndex === -1) {
      return;
    }

    const lastUserMessage = messages[lastUserMessageIndex];

    // Remove messages from the last user message onwards
    setConversation((prev) => ({
      ...prev,
      messages: prev.messages.slice(0, lastUserMessageIndex),
    }));

    // Clear error and retry
    setError(null);

    // Wait a tick for state to update
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Resend the message (strip the context indicator if present)
    const originalQuery = lastUserMessage.content.replace(
      /^\[About selected text\] /,
      ''
    );
    await sendMessage(originalQuery);
  }, [conversation.messages, sendMessage]);

  const clearConversation = useCallback((): void => {
    setConversation(createEmptyConversation());
    setError(null);
    setSelectedText(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CHAT_STORAGE_KEYS.CONVERSATION);
    }
  }, []);

  return {
    conversation,
    isLoading,
    error,
    selectedText,
    setSelectedText,
    sendMessage,
    retryLastMessage,
    clearConversation,
  };
}

export default useChat;
