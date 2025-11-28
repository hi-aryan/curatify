import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice.js';
import { getAccessToken, storeToken } from '../api/spotifyAuth.js';
import { getUserProfile } from '../api/spotifySource.js';
import { SuspenseView } from '../views/SuspenseView.jsx';

/*
    CallbackPresenter: handles Spotify OAuth callback
    
    Flow:
    1. Extract authorization code from URL
    2. Exchange code for access token
    3. Fetch user profile
    4. Dispatch login action and redirect to dashboard
    
    Note: Rendered outside RouterProvider, so we use window.location for navigation
*/
export function CallbackPresenter() {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    useEffect(() => {
        async function handleCallbackACB() {
            console.log("[Callback] Starting OAuth callback handling...");
            
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            console.log("[Callback] Authorization code:", code ? "received" : "missing");

            if (!code) {
                setError(new Error("No authorization code found"));
                return;
            }

            try {
                console.log("[Callback] Exchanging code for access token...");
                const accessToken = await getAccessToken(code);
                console.log("[Callback] Access token received:", accessToken ? "yes" : "no");
                storeToken(accessToken);

                console.log("[Callback] Fetching user profile...");
                const profile = await getUserProfile(accessToken);
                console.log("[Callback] Profile received:", profile?.display_name);

                dispatch(login({ profile, accessToken }));
                console.log("[Callback] Login dispatched, redirecting to dashboard...");
                window.location.href = window.location.origin + "/#/dashboard";
            } catch (err) {
                console.error("[Callback] Error:", err);
                setError(err);
            }
        }

        handleCallbackACB();
    }, [dispatch]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Authentication failed</p>
                    <p className="text-sm text-gray-500">{error.message}</p>
                    <button 
                        onClick={() => window.location.href = window.location.origin}
                        className="mt-4 px-4 py-2 bg-green text-dark rounded"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return <SuspenseView promise={{}} error={null} />;
}

