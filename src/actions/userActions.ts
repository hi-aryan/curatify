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

    // --- ROBUSTNESS: Data Volume Cap & Sanitization ---
    // We use the centralized utility to ensure the database record remains tiny.
    const sanitizedArtists = sanitizeArtistsForDb(topArtists);

    const updateSet: any = {
      name: profile.display_name,
      topArtists: sanitizedArtists,
    };
    
    // Only update quiz if answers were actually provided (don't wipe existing ones)
    if (quizAnswers) {
      updateSet.quizAnswers = quizAnswers;
    }

    // Upsert: Insert new user, or update if they already exist
    // Using explicit object mapping ensures columns are NEVER swapped.
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

    console.log("✅ User saved successfully");
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
