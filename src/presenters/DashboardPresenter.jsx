import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setTopArtist, setTopTracks, setTopArtists, setTopGenre } from '../store/userSlice.js';
import { clearTokenData } from '../api/spotifyAuth.js';
import { DashboardView } from '../views/DashboardView.jsx';
import { fetchTopArtist, fetchTopTracks, fetchTopArtists, fetchTopGenre } from '../utils/dashboardUtils.js';
import { callGeminiAPI, extractGeminiText } from '../api/llmSource.js';
import { getUserPlaylists } from '../api/spotifySource.js';
import { useMoodboard } from '../hooks/useMoodboard.js';

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
    
    // Moodboard state - using custom hook
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
    const { analysis: moodboardAnalysis, loading: moodboardLoading, error: moodboardError, analyze: analyzePlaylist } = useMoodboard(accessToken);

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

    // Fetch user playlists
    useEffect(() => {
        if (!accessToken) return;
        
        async function loadPlaylistsACB() {
            try {
                const response = await getUserPlaylists(accessToken, { limit: 50 });
                setPlaylists(response?.items || []);
            } catch (error) {
                console.error('Failed to fetch playlists:', error);
            }
        }
        
        loadPlaylistsACB();
    }, [accessToken]);

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
            const text = extractGeminiText(response) || "No response text found";
            setGeminiResponse(text);
        } catch (error) {
            setGeminiError(error.message || "Failed to get response from Gemini API");
        } finally {
            setGeminiLoading(false);
        }
    }

    function analyzePlaylistACB() {
        analyzePlaylist(selectedPlaylistId);
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
            playlists={playlists}
            selectedPlaylistId={selectedPlaylistId}
            onPlaylistSelect={setSelectedPlaylistId}
            onAnalyzePlaylist={analyzePlaylistACB}
            moodboardAnalysis={moodboardAnalysis}
            moodboardLoading={moodboardLoading}
            moodboardError={moodboardError}
        />
    );
}
