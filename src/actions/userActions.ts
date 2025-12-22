// server model, handles database interactions
"use server";

import { db } from "../db/index";
import { users } from "../db/schema";

import { sanitizeArtistsForDb } from "../utils/userUtils";

/**
 * Server Action: saveUserToDb
 * 
 * Serves as the "Model" interface for the server.
 * Allows Client Components (like Presenters) to securely interact with the DB.
 */
export async function saveUserToDb({
  profile,
  topArtists = [],
  quizAnswers = null,
}: {
  profile: any;
  topArtists?: any[];
  quizAnswers?: any[] | null;
}) {
  try {
    if (!profile?.id) {
      console.error("❌ saveUserToDb: No profile ID provided");
      return { success: false, error: "Invalid profile data" };
    }

    console.log(
      `💾 Saving user to DB: ${profile.id} (${profile.display_name}) with ${topArtists.length} input artists`
    );

    // only update topArtists or quizAnswers if they're actually provided (prevents partial updates, like just a quiz sync, from wiping existing artist data)
    const sanitizedArtists = sanitizeArtistsForDb(topArtists);
    
    const updateSet: any = {
      name: profile.display_name,
    };

    if (sanitizedArtists.length > 0) {
      updateSet.topArtists = sanitizedArtists;
    }
    
    if (quizAnswers && quizAnswers.length > 0) {
      updateSet.quizAnswers = quizAnswers;
    }

    // Upsert: Insert new user, or update if they already exist
    // only commit the fields present in updateSet.
    await db
      .insert(users)
      .values({
        spotifyId: profile.id,
        name: profile.display_name,
        topArtists: sanitizedArtists,
        quizAnswers: quizAnswers,
      })
      .onConflictDoUpdate({
        target: users.spotifyId,
        set: updateSet,
      });

    console.log(`✅ User saved: committed ${sanitizedArtists.length} artists and ${quizAnswers?.length || 0} answers`);

    return { success: true };
  } catch (error) {
    console.error("❌ DB Error in saveUserToDb:", error);
    // Return safe error object, don't throw to client
    return { success: false, error: "Database operation failed" };
  }
}

/**
 * Fetch a user record from the database by Spotify ID
 * @param {string} spotifyId - The user's Spotify ID
 */
export async function getUserFromDb(spotifyId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.spotifyId, spotifyId),
    });
    return user || null;
  } catch (error) {
    console.error("❌ DB Error in getUserFromDb:", error);
    return null;
  }
}

/**
 * Fetch a NON-PRIVATE user record from the database by Spotify ID.
 * This ensures sensitive data like quizAnswers is NEVER leaked to other users.
 * @param {string} spotifyId - The user's Spotify ID
 */
export async function getPublicUserProfile(spotifyId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.spotifyId, spotifyId),
      columns: {
        id: true,
        name: true,
        topArtists: true,
        spotifyId: true,
        // quizAnswers: false // Explicitly excluded by only selecting the above
      }
    });
    return user || null;
  } catch (error) {
    console.error("❌ DB Error in getPublicUserProfile:", error);
    return null;
  }
}
