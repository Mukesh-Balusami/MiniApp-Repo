import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  heading: varchar('heading', {length: 100}).notNull(),
  content: varchar('content', {length: 500}).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});