import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setTopArtist, setTopTracks, setTopArtists, setTopGenre } from '../store/userSlice.js';
import { clearTokenData } from '../api/spotifyAuth.js';
import { DashboardView } from '../views/DashboardView.jsx';
import { fetchTopArtist, fetchTopTracks, fetchTopArtists, fetchTopGenre } from '../utils/dashboardUtils.js';
import { callGeminiAPI, extractGeminiText } from '../api/llmSource.js';

/*
    DashboardPresenter: connects Redux store to DashboardView
    
    Pattern:
    - Read user state from Redux
    - Call utils for data fetching/orchestration
    - Dispatch actions to update state
    - Pass to View as props
*/
export function DashboardPresenter() {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.user.profile);
    const accessToken = useSelector((state) => state.user.accessToken);
    const topArtist = useSelector((state) => state.user.topArtist);
    const topTracks = useSelector((state) => state.user.topTracks);
    const topArtists = useSelector((state) => state.user.topArtists);
    const topGenre = useSelector((state) => state.user.topGenre);
    
    // Gemini state (local - ephemeral UI state, not persisted in Redux)
    const [geminiPrompt, setGeminiPrompt] = useState("");
    const [geminiResponse, setGeminiResponse] = useState("");
    const [geminiLoading, setGeminiLoading] = useState(false);
    const [geminiError, setGeminiError] = useState(null);

    useEffect(() => {
        if (!accessToken) return;
        
        async function loadDashboardDataACB() {
            if (!topArtist) {
                try {
                    const artist = await fetchTopArtist(accessToken);
                    if (artist) dispatch(setTopArtist(artist));
                } catch (error) {
                    console.error('Failed to fetch top artist:', error);
                }
            }
            
            if (!topTracks) {
                try {
                    const tracks = await fetchTopTracks(accessToken, 3);
                    dispatch(setTopTracks(tracks));
                } catch (error) {
                    console.error('Failed to fetch top tracks:', error);
                }
            }
            
            if (!topArtists) {
                try {
                    const artists = await fetchTopArtists(accessToken, 10);
                    dispatch(setTopArtists(artists));
                } catch (error) {
                    console.error('Failed to fetch top artists:', error);
                }
            }
            
            if (!topGenre) {
                try {
                    const genre = await fetchTopGenre(accessToken);
                    if (genre) dispatch(setTopGenre(genre));
                } catch (error) {
                    console.error('Failed to fetch top genre:', error);
                }
            }
        }
        
        loadDashboardDataACB();
    }, [accessToken, topArtist, topTracks, topArtists, topGenre, dispatch]);

    function logoutACB() {
        clearTokenData();
        dispatch(logout());
        window.location.href = window.location.origin;
    }

    async function callGeminiACB() {
        if (!geminiPrompt.trim()) return;
        
        setGeminiLoading(true);
        setGeminiError(null);
        setGeminiResponse("");
        
        try {
            const response = await callGeminiAPI(geminiPrompt);
            // Extract text from Gemini API response format
            const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found";
            setGeminiResponse(text);
        } catch (error) {
            setGeminiError(error.message || "Failed to get response from Gemini API");
            console.error('Gemini API error:', error);
        } finally {
            setGeminiLoading(false);
        }
    }

    return (
        <DashboardView
            profile={profile}
            favoriteArtist={topArtist}
            topTracks={topTracks}
            topArtists={topArtists}
            topGenre={topGenre}
            onLogout={logoutACB}
            geminiPrompt={geminiPrompt}
            geminiResponse={geminiResponse}
            geminiLoading={geminiLoading}
            geminiError={geminiError}
            onGeminiPromptChange={setGeminiPrompt}
            onTestGemini={callGeminiACB}
        />
    );
}
