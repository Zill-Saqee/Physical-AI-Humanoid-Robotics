/**
 * TextSelectionPopover Component
 * Feature: 002-rag-chatbot
 *
 * Shows a popover when text is selected, allowing users to ask questions
 * about the selected content.
 */

import React, { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

interface TextSelectionPopoverProps {
  onAskAboutSelection: (selectedText: string) => void;
}

interface PopoverPosition {
  x: number;
  y: number;
}

export function TextSelectionPopover({
  onAskAboutSelection,
}: TextSelectionPopoverProps): React.ReactElement | null {
  const [selectedText, setSelectedText] = useState<string>('');
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || '';

    if (text.length > 10 && text.length < 2000) {
      // Get selection position
      const range = selection?.getRangeAt(0);
      if (range) {
        const rect = range.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
        setSelectedText(text);
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
      setSelectedText('');
    }
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.popover}`)) {
        // Delay hiding to allow button click to register
        setTimeout(() => {
          const selection = window.getSelection();
          const text = selection?.toString().trim() || '';
          if (text.length < 10) {
            setIsVisible(false);
            setSelectedText('');
          }
        }, 100);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('click', handleClick);
    };
  }, [handleSelection, handleClick]);

  const handleAskClick = () => {
    if (selectedText) {
      onAskAboutSelection(selectedText);
      setIsVisible(false);
      setSelectedText('');
      // Clear the selection
      window.getSelection()?.removeAllRanges();
    }
  };

  if (!isVisible || !position) {
    return null;
  }

  return (
    <div
      className={styles.popover}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <button
        className={styles.askButton}
        onClick={handleAskClick}
        type="button"
        aria-label="Ask about selected text"
      >
        <ChatIcon />
        <span>Ask about this</span>
      </button>
    </div>
  );
}

function ChatIcon(): React.ReactElement {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default TextSelectionPopover;
