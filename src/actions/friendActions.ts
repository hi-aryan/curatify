'use server';

import { db } from '../db/index';
import { follows, users } from '../db/schema';
import { eq, and, ilike } from 'drizzle-orm';

interface ActionResponse {
    success: boolean;
    message?: string;
    error?: string;
}

/*
  Server Action: followUser
  Adds a relationship to the follows table.
*/
export async function followUser(currentSpotifyId: string, targetNameOrId: string): Promise<ActionResponse> {
    try {
        if (!currentSpotifyId) return { success: false, error: 'Not authenticated' };

        // 1. Get Current User ID from DB
        const currentUser = await db.query.users.findFirst({
            where: eq(users.spotifyId, currentSpotifyId),
        });

        if (!currentUser) return { success: false, error: 'Current user not found' };

        // 2. Find Target User
        // Strategy: Try exact match on 'spotifyId' OR 'name'
        const targetUser = await db.query.users.findFirst({
            where: (users, { or, eq }) => or(
                eq(users.spotifyId, targetNameOrId),
                eq(users.name, targetNameOrId)
            ),
        });

        if (!targetUser) return { success: false, error: 'User not found' };

        if (currentUser.id === targetUser.id) {
            return { success: false, error: 'You cannot follow yourself' };
        }

        // 3. Check if already following
        const existingFollow = await db.query.follows.findFirst({
            where: and(
                eq(follows.followerId, currentUser.id),
                eq(follows.followingId, targetUser.id)
            ),
        });

        if (existingFollow) return { success: false, error: 'Already following this user' };

        // 4. Insert Follow
        await db.insert(follows).values({
            followerId: currentUser.id,
            followingId: targetUser.id,
        });

        return { success: true, message: `You are now following ${targetUser.name}` };

    } catch (error) {
        console.error('❌ followUser Error:', error);
        return { success: false, error: 'Database error' };
    }
}

/*
  Server Action: unfollowUser
  Removes a relationship from the follows table.
*/
export async function unfollowUser(currentSpotifyId: string, targetUserId: number): Promise<ActionResponse> {
    try {
        if (!currentSpotifyId) return { success: false, error: 'Not authenticated' };

        const currentUser = await db.query.users.findFirst({
            where: eq(users.spotifyId, currentSpotifyId),
        });

        if (!currentUser) return { success: false, error: 'Current user not found' };

        await db.delete(follows)
            .where(and(
                eq(follows.followerId, currentUser.id),
                eq(follows.followingId, targetUserId)
            ));

        return { success: true, message: 'Unfollowed user' };

    } catch (error) {
        console.error('❌ unfollowUser Error:', error);
        return { success: false, error: 'Database error' };
    }
}

/*
  Server Action: searchUsers
  Finds users by name or spotifyId, excluding the current user.
*/
export async function searchUsers(currentSpotifyId: string, query: string) {
    try {
        if (!currentSpotifyId || !query) return [];

        const currentUser = await db.query.users.findFirst({
            where: eq(users.spotifyId, currentSpotifyId),
        });

        // Simple search: Name or SpotifyID matches query (case-insensitive usually handled by DB collation, but here we assume exact/partial depends on DB)
        // For strict MVP with simple query:
        // We will fetch users who match and ARE NOT the current user.
        // NOTE: In a real app, use ilike or similar. Drizzle-orm 'like' operator.
        // For now, let's use exact match or partial if we import 'like'.
        // Let's stick to the 'findMany' with 'like'.
        // But 'like' needs to be imported.
        
        // Simpler approach for Small MVP DB: Get matches on name/id
        
        const matches = await db.query.users.findMany({
            where: (users, { or, eq, and, ne, ilike }) => and(
                or(
                    ilike(users.spotifyId, `%${query}%`), // Partial match on ID
                    ilike(users.name, `%${query}%`)       // Partial match on Name
                ),
                ne(users.spotifyId, currentSpotifyId) // Exclude self
            ),
            limit: 5 // Limit results
        });

        return matches;

    } catch (error) {
        console.error('❌ searchUsers Error:', error);
        return [];
    }
}

/*
  Server Action: getFollowedUsers
  Returns list of users that the current user follows.
*/
export async function getFollowedUsers(currentSpotifyId: string) {
    try {
        if (!currentSpotifyId) return [];

        const currentUser = await db.query.users.findFirst({
            where: eq(users.spotifyId, currentSpotifyId),
            with: {
                following: {
                    with: {
                        following: true // Get the user details of the person they follow
                    }
                }
            }
        });

        if (!currentUser || !currentUser.following) return [];

        // Transform to simple array of users
        return currentUser.following.map((f: any) => f.following);

    } catch (error) {
        console.error('❌ getFollowedUsers Error:', error);
        return [];
    }
}
