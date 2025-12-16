import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    spotifyId: text('spotify_id').unique().notNull(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
});
