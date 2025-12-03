import { useState } from 'react';
import { analyzePlaylistMood } from '../utils/dashboardUtils.js';
import { getValidAccessToken } from '../api/spotifyAuth.js';

/**
 * Custom hook for moodboard analysis
 * Encapsulates all moodboard-related state and logic
 * Gets its own access token internally - no need to pass it
 * 
 * @returns {Object} - { analysis, loading, error, analyze }
 */
export function useMoodboard() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    /**
     * Analyze a playlist
     * @param {string} playlistId - Spotify playlist ID
     */
    async function analyze(playlistId) {
        if (!playlistId) return;
        
        setLoading(true);
        setError(null);
        setAnalysis(null);
        
        try {
            const accessToken = await getValidAccessToken();
            if (!accessToken) {
                throw new Error("Not authenticated");
            }
            const result = await analyzePlaylistMood(playlistId, accessToken);
            setAnalysis(result);
        } catch (err) {
            setError(err.message || "Failed to analyze playlist");
        } finally {
            setLoading(false);
        }
    }
    
    return { 
        analysis,
        loading,
        error,
        analyze
    };
}

