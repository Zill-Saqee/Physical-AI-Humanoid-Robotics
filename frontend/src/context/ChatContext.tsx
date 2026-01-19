/**
 * Chat Context
 * Feature: 002-rag-chatbot
 *
 * Provides chat state and actions to components throughout the app.
 */

import React, { createContext, useContext, useCallback } from 'react';
import { useChat } from '../hooks/useChat';
import { useChatWidget } from '../hooks/useChatWidget';
import type { UseChatResult, UseChatWidgetResult } from '../types/chat';

interface ChatContextValue extends UseChatResult, UseChatWidgetResult {
  askAboutSelection: (text: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps): React.ReactElement {
  const chat = useChat();
  const widget = useChatWidget();

  const askAboutSelection = useCallback(
    (text: string) => {
      // Set the selected text
      chat.setSelectedText(text);
      // Open the chat widget
      widget.open();
    },
    [chat, widget]
  );

  const value: ChatContextValue = {
    ...chat,
    ...widget,
    askAboutSelection,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

export default ChatContext;
