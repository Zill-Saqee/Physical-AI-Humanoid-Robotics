/**
 * Database Initialization Script
 * Feature: 002-rag-chatbot
 *
 * Creates the necessary tables in Neon Postgres for conversation persistence.
 *
 * Usage: npx ts-node scripts/init-db.ts
 */

import { initializeSchema, checkConnection } from '../lib/db';

async function main(): Promise<void> {
  console.log('=== RAG Chatbot Database Initialization ===\n');

  // Check environment
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is required');
    console.error('Create a .env.local file with your Neon connection string');
    process.exit(1);
  }

  try {
    // Test connection
    console.log('Testing database connection...');
    const connected = await checkConnection();

    if (!connected) {
      throw new Error('Failed to connect to database');
    }
    console.log('Connection successful!\n');

    // Initialize schema
    console.log('Creating tables...');
    await initializeSchema();
    console.log('Tables created successfully!\n');

    console.log('=== Database Initialization Complete ===');
    console.log('\nTables created:');
    console.log('  - conversations (id, created_at, updated_at)');
    console.log('  - messages (id, conversation_id, role, content, sources, created_at)');
    console.log('\nYou can now run the chatbot!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

main();
