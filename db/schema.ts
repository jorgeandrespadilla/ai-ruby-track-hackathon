import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const transcriptsTable = pgTable('transcripts_table', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  fileUrl: text('file_url'),
  text: text('text'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const complaintsTable = pgTable('complaints_table', {
  id: serial('id').primaryKey(),
  transcriptId: integer('transcript_id')
    .notNull()
    .references(() => transcriptsTable.id, { onDelete: 'cascade' }),
  summary: text('summary').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertTranscript = typeof transcriptsTable.$inferInsert;
export type SelectTranscript = typeof transcriptsTable.$inferSelect; 
export type InsertComplaint = typeof complaintsTable.$inferInsert;
export type SelectComplaint = typeof complaintsTable.$inferSelect;
