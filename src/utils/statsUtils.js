/*
    statsUtils.js: Calculation functions for user statistics
    
    Pattern:
    - Pure functions (no side effects)
    - Take data as input, return calculated results
    - Easy to test and reuse
*/

/**
 * Calculate the most common genre from tracks and their associated artists
 * @param {Array} tracks - Array of track objects with artists array
 * @param {Array} artists - Array of artist objects with genres property
 * @returns {string|null} - The most common genre, or null if no genres found
 */
export function calculateTopGenreFromTracks(tracks, artists) {
    if (!tracks || tracks.length === 0 || !artists || artists.length === 0) {
        return null;
    }
    
    // Step 1: Create a map of artist ID to artist object for quick lookup
    const artistMap = new Map();
    artists.forEach(artist => {
        artistMap.set(artist.id, artist);
    });
    
    // Step 2: Collect all genres from artists that appear in the tracks
    const allGenres = [];
    tracks.forEach(track => {
        if (track.artists && track.artists.length > 0) {
            track.artists.forEach(trackArtist => {
                const fullArtist = artistMap.get(trackArtist.id);
                if (fullArtist && fullArtist.genres && fullArtist.genres.length > 0) {
                    // Add all genres from this artist
                    allGenres.push(...fullArtist.genres);
                }
            });
        }
    });
    
    if (allGenres.length === 0) {
        return null;
    }
    
    // Step 3: Count occurrences of each genre
    const genreCount = {};
    allGenres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
    
    // Step 4: Find the genre with the highest count
    let topGenre = null;
    let maxCount = 0;
    Object.entries(genreCount).forEach(([genre, count]) => {
        if (count > maxCount) {
            maxCount = count;
            topGenre = genre;
        }
    });
    
    return topGenre;
}

