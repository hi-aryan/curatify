/**
 * Centralized limit for how many artists we store in the database.
 * Higher values cause terminal rendering issues in dev-mode due to row bloat.
 * 1 is sufficient for the current "Friends" and "Social" features.
 */
export const DB_ARTIST_LIMIT = 1;

export interface DbArtist {
  id: string;
  name: string;
  image: string | null;
}

/**
 * Robustly sanitizes and caps a list of artists for database storage.
 * Handles both raw Spotify API objects and already-sanitized objects.
 * 
 * @param artists - Array of artist objects (raw or partial)
 * @returns Clean array of exactly {DB_ARTIST_LIMIT} artists
 */
export function sanitizeArtistsForDb(artists: any[] | null | undefined): DbArtist[] {
  if (!artists || !Array.isArray(artists) || artists.length === 0) return [];

  return artists.slice(0, DB_ARTIST_LIMIT).map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    // image fallback: raw spotify metadata OR our internal lean format
    image: Array.isArray(artist.images) 
      ? (artist.images?.[0]?.url || null) 
      : (artist.image || null),
  }));
}
