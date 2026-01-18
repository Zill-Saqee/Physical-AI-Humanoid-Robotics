/**
 * RAG Chatbot Component Contracts
 * Feature: 002-rag-chatbot
 * Generated: 2026-01-18
 *
 * These interfaces define the component props and data structures
 * for the RAG chatbot feature. Implementation must conform to these contracts.
 */

// =============================================================================
// CORE DATA TYPES
// =============================================================================

/**
 * A chunk of textbook content stored in the vector database
 */
export interface TextChunk {
  /** Unique identifier: ch{N}_sec{N}_{index} */
  id: string;
  /** Chapter number (1-6) */
  chapterNumber: number;
  /** Chapter title */
  chapterTitle: string;
  /** Section identifier: {chapter}.{section} */
  sectionId: string;
  /** Section heading */
  sectionTitle: string;
  /** Chunk text content (50-500 tokens) */
  content: string;
  /** Order within chapter */
  position: number;
  /** Token count */
  tokenCount: number;
}

/**
 * Reference to a source chunk used in generating a response
 */
export interface SourceReference {
  /** Referenced TextChunk.id */
  chunkId: string;
  /** Chapter number for display */
  chapterNumber: number;
  /** Section name for display */
  sectionTitle: string;
  /** Internal URL to navigate to section */
  url: string;
  /** Retrieval similarity score (0-1) */
  relevanceScore: number;
}

/**
 * Message role in conversation
 */
export type MessageRole = 'user' | 'assistant';

/**
 * A single message in the conversation
 */
export interface Message {
  /** Unique message ID (UUID v4) */
  id: string;
  /** Who sent the message */
  role: MessageRole;
  /** Message text content */
  content: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Source citations (assistant messages only) */
  sources?: SourceReference[];
}

/**
 * Complete conversation state
 */
export interface Conversation {
  /** Session identifier (UUID v4) */
  id: string;
  /** Ordered list of messages */
  messages: Message[];
  /** Session start time (ISO 8601) */
  createdAt: string;
  /** Last activity time (ISO 8601) */
  lastActivityAt: string;
}

// =============================================================================
// API CONTRACTS
// =============================================================================

/**
 * Request payload for chat endpoint
 */
export interface ChatRequest {
  /** User's question (1-1000 chars) */
  query: string;
  /** Previous messages for context (max 10) */
  conversationHistory?: Message[];
  /** Text selected by user for contextual Q&A */
  selectedText?: string;
  /** Conversation ID for persistence */
  conversationId?: string;
  /** Message ID for persistence */
  messageId?: string;
}

/**
 * Streaming event types
 */
export type StreamEventType = 'token' | 'sources' | 'done' | 'error';

/**
 * Token event - partial response text
 */
export interface TokenEvent {
  type: 'token';
  content: string;
}

/**
 * Sources event - citation attributions
 */
export interface SourcesEvent {
  type: 'sources';
  citations: SourceReference[];
}

/**
 * Done event - stream complete
 */
export interface DoneEvent {
  type: 'done';
}

/**
 * Error event - something went wrong
 */
export interface ErrorEvent {
  type: 'error';
  message: string;
  code: 'RATE_LIMIT' | 'TIMEOUT' | 'SERVICE_ERROR' | 'INVALID_REQUEST';
}

/**
 * Union of all stream events
 */
export type StreamEvent = TokenEvent | SourcesEvent | DoneEvent | ErrorEvent;

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Props for the main ChatWidget component
 */
export interface ChatWidgetProps {
  /** Initial open state */
  defaultOpen?: boolean;
  /** Callback when widget opens/closes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Custom welcome message */
  welcomeMessage?: string;
  /** Placeholder text for input */
  inputPlaceholder?: string;
}

/**
 * Props for the ChatButton (floating action button)
 */
export interface ChatButtonProps {
  /** Whether chat is currently open */
  isOpen: boolean;
  /** Click handler to toggle chat */
  onClick: () => void;
  /** Unread message count (optional) */
  unreadCount?: number;
}

/**
 * Props for the ChatPanel (conversation container)
 */
export interface ChatPanelProps {
  /** Current conversation */
  conversation: Conversation;
  /** Whether assistant is currently responding */
  isLoading: boolean;
  /** Error message if any */
  error?: string;
  /** Handler to send a new message */
  onSendMessage: (query: string) => void;
  /** Handler to close panel */
  onClose: () => void;
  /** Handler to retry last message */
  onRetry?: () => void;
  /** Currently selected text for context */
  selectedText?: string | null;
}

/**
 * Props for individual message display
 */
export interface MessageBubbleProps {
  /** The message to display */
  message: Message;
  /** Whether this message is currently streaming */
  isStreaming?: boolean;
  /** Handler when source reference is clicked */
  onSourceClick?: (source: SourceReference) => void;
}

/**
 * Props for the message input component
 */
export interface ChatInputProps {
  /** Current input value */
  value: string;
  /** Input change handler */
  onChange: (value: string) => void;
  /** Submit handler */
  onSubmit: () => void;
  /** Whether input is disabled (e.g., during loading) */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum character length */
  maxLength?: number;
}

/**
 * Props for source reference display
 */
export interface SourceListProps {
  /** List of sources to display */
  sources: SourceReference[];
  /** Click handler for source links */
  onSourceClick: (source: SourceReference) => void;
}

/**
 * Props for loading indicator
 */
export interface LoadingIndicatorProps {
  /** Loading message text */
  message?: string;
}

/**
 * Props for error display
 */
export interface ErrorDisplayProps {
  /** Error message */
  message: string;
  /** Whether retry is available */
  canRetry?: boolean;
  /** Retry handler */
  onRetry?: () => void;
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

/**
 * Return type for useChat hook
 */
export interface UseChatResult {
  /** Current conversation state */
  conversation: Conversation;
  /** Whether a response is being generated */
  isLoading: boolean;
  /** Current error if any */
  error: string | null;
  /** Currently selected text for contextual Q&A */
  selectedText: string | null;
  /** Set selected text for contextual Q&A */
  setSelectedText: (text: string | null) => void;
  /** Send a message (optionally with selected text context) */
  sendMessage: (query: string, selectedText?: string) => Promise<void>;
  /** Retry last failed message */
  retryLastMessage: () => Promise<void>;
  /** Clear conversation history */
  clearConversation: () => void;
}

/**
 * Return type for useChatWidget hook
 */
export interface UseChatWidgetResult {
  /** Whether widget is open */
  isOpen: boolean;
  /** Open the widget */
  open: () => void;
  /** Close the widget */
  close: () => void;
  /** Toggle widget state */
  toggle: () => void;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Chat configuration options
 */
export interface ChatConfig {
  /** API endpoint for chat */
  apiEndpoint: string;
  /** Maximum messages to include in context */
  maxContextMessages: number;
  /** Maximum query length in characters */
  maxQueryLength: number;
  /** Response timeout in milliseconds */
  responseTimeout: number;
  /** Minimum time between requests in milliseconds */
  rateLimitMs: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_CHAT_CONFIG: ChatConfig = {
  apiEndpoint: '/api/chat',
  maxContextMessages: 10,
  maxQueryLength: 1000,
  responseTimeout: 5000,
  rateLimitMs: 2000,
};

// =============================================================================
// STORAGE KEYS
// =============================================================================

/**
 * Session storage keys for chat state
 */
export const CHAT_STORAGE_KEYS = {
  CONVERSATION: 'rag-chat-conversation',
  WIDGET_STATE: 'rag-chat-widget-open',
} as const;
