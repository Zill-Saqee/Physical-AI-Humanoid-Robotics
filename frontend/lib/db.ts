/**
 * Neon Postgres Database Utility
 * Feature: 002-rag-chatbot
 *
 * Provides database connection and conversation persistence.
 */

import { neon, neonConfig } from '@neondatabase/serverless';

// Configure for serverless environment
neonConfig.fetchConnectionCache = true;

// Get database connection
function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  return neon(databaseUrl);
}

/**
 * Initialize database schema
 * Run this once to set up tables
 */
export async function initializeSchema(): Promise<void> {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id UUID PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY,
      conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
      role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      sources JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
    ON messages(conversation_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_messages_created_at
    ON messages(created_at)
  `;
}

/**
 * Create a new conversation
 */
export async function createConversation(id: string): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO conversations (id) VALUES (${id})
    ON CONFLICT (id) DO NOTHING
  `;
}

/**
 * Save a message to the database
 */
export async function saveMessage(
  conversationId: string,
  messageId: string,
  role: 'user' | 'assistant',
  content: string,
  sources?: unknown[]
): Promise<void> {
  const sql = getDb();

  // Ensure conversation exists
  await createConversation(conversationId);

  await sql`
    INSERT INTO messages (id, conversation_id, role, content, sources)
    VALUES (${messageId}, ${conversationId}, ${role}, ${content}, ${JSON.stringify(sources || [])})
  `;

  // Update conversation timestamp
  await sql`
    UPDATE conversations SET updated_at = NOW() WHERE id = ${conversationId}
  `;
}

/**
 * Get conversation history
 */
export async function getConversationHistory(
  conversationId: string,
  limit: number = 10
): Promise<Array<{
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources: unknown[];
  created_at: string;
}>> {
  const sql = getDb();

  const rows = await sql`
    SELECT id, role, content, sources, created_at
    FROM messages
    WHERE conversation_id = ${conversationId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  // Return in chronological order
  return rows.reverse() as Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources: unknown[];
    created_at: string;
  }>;
}

/**
 * Delete old conversations (cleanup)
 */
export async function cleanupOldConversations(daysOld: number = 7): Promise<number> {
  const sql = getDb();

  const result = await sql`
    DELETE FROM conversations
    WHERE updated_at < NOW() - INTERVAL '${daysOld} days'
    RETURNING id
  `;

  return result.length;
}

/**
 * Check if database is connected
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const sql = getDb();
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
