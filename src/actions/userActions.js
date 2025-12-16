// server model, handles database interactions
'use server';

import { db } from '../db/index.js';
import { users } from '../db/schema.js';

/*
  Server Action: saveUserToDb
  
  Serves as the "Model" interface for the server.
  Allows Client Components (like Presenters) to securely interact with the DB.
*/
export async function saveUserToDb(profile) {
    try {
        if (!profile?.id) {
            console.error('❌ saveUserToDb: No profile ID provided');
            return { success: false, error: 'Invalid profile data' };
        }

        console.log(`💾 Saving user to DB: ${profile.id} (${profile.display_name})`);

        // Upsert: Insert new user, or update name if they already exist
        await db.insert(users)
            .values({
                spotifyId: profile.id,
                name: profile.display_name,
            })
            .onConflictDoUpdate({
                target: users.spotifyId,
                set: { name: profile.display_name },
            });

        console.log('✅ User saved successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ DB Error in saveUserToDb:', error);
        // Return safe error object, don't throw to client
        return { success: false, error: 'Database operation failed' };
    }
}
