/**
 * ChatWidget Component
 * Feature: 002-rag-chatbot
 *
 * Main export for the chat widget, combining button and panel.
 */

import React from 'react';
import type { ChatWidgetProps } from '../../types/chat';
import { useChatWidget } from '../../hooks/useChatWidget';
import { useChat } from '../../hooks/useChat';
import { ChatButton } from './ChatButton';
import { ChatPanel } from './ChatPanel';

export function ChatWidget({
  defaultOpen = false,
  onOpenChange,
  // Note: welcomeMessage and inputPlaceholder reserved for future customization
}: ChatWidgetProps): React.ReactElement {
  const { isOpen, toggle, close } = useChatWidget(defaultOpen, onOpenChange);
  const {
    conversation,
    isLoading,
    error,
    sendMessage,
    retryLastMessage,
  } = useChat();

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={toggle} />
      {isOpen && (
        <ChatPanel
          conversation={conversation}
          isLoading={isLoading}
          error={error ?? undefined}
          onSendMessage={sendMessage}
          onClose={close}
          onRetry={error ? retryLastMessage : undefined}
        />
      )}
    </>
  );
}

export default ChatWidget;
