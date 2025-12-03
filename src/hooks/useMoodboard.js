import { useState } from 'react';
import { analyzePlaylistMood } from '../utils/dashboardUtils.js';

/**
 * Custom hook for moodboard analysis
 * Encapsulates all moodboard-related state and logic
 * 
 * @param {string} accessToken - Spotify access token
 * @returns {Object} - { analysis, loading, error, analyze }
 */
export function useMoodboard(accessToken) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    /**
     * Analyze a playlist
     * @param {string} playlistId - Spotify playlist ID
     */
    async function analyze(playlistId) {
        if (!playlistId || !accessToken) return;
        
        setLoading(true);
        setError(null);
        setAnalysis(null);
        
        try {
            const result = await analyzePlaylistMood(playlistId, accessToken);
            setAnalysis(result);
        } catch (err) {
            setError(err.message || "Failed to analyze playlist");
        } finally {
            setLoading(false);
        }
    }
    
    return { 
        analysis,      // The result
        loading,       // Loading state
        error,         // Error message
        analyze        // Function to trigger analysis
    };
}

