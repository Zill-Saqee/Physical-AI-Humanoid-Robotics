/**
 * useChatWidget Hook
 * Feature: 002-rag-chatbot
 *
 * Manages chat widget open/close state with persistence.
 */

import { useState, useCallback, useEffect } from 'react';
import type { UseChatWidgetResult } from '../types/chat';
import { CHAT_STORAGE_KEYS } from '../types/chat';

export function useChatWidget(
  defaultOpen: boolean = false,
  onOpenChange?: (isOpen: boolean) => void
): UseChatWidgetResult {
  const [isOpen, setIsOpen] = useState(() => {
    // Try to restore from sessionStorage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(CHAT_STORAGE_KEYS.WIDGET_STATE);
      if (stored !== null) {
        return stored === 'true';
      }
    }
    return defaultOpen;
  });

  // Persist state to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(CHAT_STORAGE_KEYS.WIDGET_STATE, String(isOpen));
    }
  }, [isOpen]);

  // Notify parent of changes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

export default useChatWidget;
