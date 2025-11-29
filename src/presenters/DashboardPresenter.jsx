import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; /* instead of mobx observer and mobx actions */
import { logout, setTopArtist, setTopTracks, setTopArtists } from '../store/userSlice.js';
import { clearTokenData } from '../api/spotifyAuth.js';
import { DashboardView } from '../views/DashboardView.jsx';
import { getUserTopArtists, getUserTopTracks } from '../api/spotifySource.js';
import { callGeminiAPI } from '../api/llmSource.js';

/*
    DashboardPresenter: connects Redux store to DashboardView
    
    Pattern:
    - Read user state from Redux
    - Define ACB functions for user actions
    - Pass to View as props
*/
export function DashboardPresenter() {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.user.profile);
    const accessToken = useSelector((state) => state.user.accessToken);
    const topArtist = useSelector((state) => state.user.topArtist);
    const topTracks = useSelector((state) => state.user.topTracks);
    const topArtists = useSelector((state) => state.user.topArtists);
    
    // Gemini state
    const [geminiPrompt, setGeminiPrompt] = useState("");
    const [geminiResponse, setGeminiResponse] = useState("");
    const [geminiLoading, setGeminiLoading] = useState(false);
    const [geminiError, setGeminiError] = useState(null);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        async function fetchTopArtistACB() {
            if (topArtist) return;
            try {
                const response = await getUserTopArtists(accessToken, { limit: 1 });
                const favorite = response?.items?.[0];

                if (favorite) {
                    dispatch(setTopArtist({
                        name: favorite.name,
                        image: favorite.images?.[0]?.url || null,
                        url: favorite.external_urls?.spotify || null,
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch top artist:', error);
            }
        }

        async function fetchTopTracksACB() {
            if (topTracks) return;
            try {
                const response = await getUserTopTracks(accessToken, { limit: 3 });
                const tracks = response?.items?.slice(0, 3) || [];
                dispatch(setTopTracks(tracks));
            } catch (error) {
                console.error('Failed to fetch top tracks:', error);
            }
        }

        async function fetchTopArtistsACB() {
            if (topArtists) return;
            try {
                const response = await getUserTopArtists(accessToken, { limit: 10 });
                const artists = response?.items || [];
                dispatch(setTopArtists(artists));
            } catch (error) {
                console.error('Failed to fetch top artists:', error);
            }
        }

        fetchTopArtistACB();
        fetchTopTracksACB();
        fetchTopArtistsACB();
    }, [accessToken, topArtist, topTracks, topArtists, dispatch]);

    function logoutACB() {
        clearTokenData();
        dispatch(logout());
        window.location.href = window.location.origin;
    }

    async function callGeminiACB() {
        if (!geminiPrompt.trim()) {
            return;
        }
        
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

