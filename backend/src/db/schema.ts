import { pgTable, text, timestamp, uuid, jsonb, index, integer } from 'drizzle-orm/pg-core';

export const tarotSpreadsV2 = pgTable('tarot_spreads_v2', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  persona: text('persona').notNull(),
  spreadType: text('spread_type').notNull(),
  userQuery: text('user_query'),
  cards: jsonb('cards').notNull(),
  positionMeanings: jsonb('position_meanings').notNull(),
  integratedSummary: text('integrated_summary').notNull(),
  advice: jsonb('advice').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const pdfChunks = pgTable(
  'pdf_chunks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cardName: text('card_name').notNull(),
    chunkText: text('chunk_text').notNull(),
    chunkIndex: integer('chunk_index').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    cardNameIdx: index('card_name_idx').on(table.cardName),
  })
);

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type'),
  lastModified: timestamp('last_modified').defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const githubSettings = pgTable('github_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  githubToken: text('github_token').notNull(),
  repoOwner: text('repo_owner').notNull().default('r73723189-alt'),
  repoName: text('repo_name').notNull().default('Gnosis-'),
  autoSync: text('auto_sync').notNull().default('false'),
  lastSync: timestamp('last_sync'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
