/**
 * ChatWidgetInner Component
 * Feature: 002-rag-chatbot
 *
 * Inner chat widget component that uses ChatContext.
 * Separated to allow context-based state management.
 */

import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import { ChatButton } from './ChatButton';
import { ChatPanel } from './ChatPanel';

export function ChatWidgetInner(): React.ReactElement {
  const {
    isOpen,
    toggle,
    close,
    conversation,
    isLoading,
    error,
    selectedText,
    sendMessage,
    retryLastMessage,
  } = useChatContext();

  const handleSendMessage = (query: string) => {
    // If there's selected text, include it in the message
    sendMessage(query, selectedText || undefined);
  };

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={toggle} />
      {isOpen && (
        <ChatPanel
          conversation={conversation}
          isLoading={isLoading}
          error={error ?? undefined}
          onSendMessage={handleSendMessage}
          onClose={close}
          onRetry={error ? retryLastMessage : undefined}
          selectedText={selectedText}
        />
      )}
    </>
  );
}

export default ChatWidgetInner;
