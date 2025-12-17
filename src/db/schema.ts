import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    spotifyId: text('spotify_id').unique().notNull(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const follows = pgTable('follows', {
    id: serial('id').primaryKey(),
    followerId: integer('follower_id').references(() => users.id).notNull(),
    followingId: integer('following_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    following: many(follows, { relationName: 'following' }),
    followers: many(follows, { relationName: 'followers' }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
    follower: one(users, {
        fields: [follows.followerId],
        references: [users.id],
        relationName: 'following',
    }),
    following: one(users, {
        fields: [follows.followingId],
        references: [users.id],
        relationName: 'followers',
    }),
}));
