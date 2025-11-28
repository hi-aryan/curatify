import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice.js';
import { getAccessToken, storeToken } from '../api/spotifyAuth.js';
import { getUserProfile } from '../api/spotifySource.js';
import { CallbackView } from '../views/CallbackView.jsx';

/*
    CallbackPresenter: handles Spotify OAuth callback

    Pattern:
    - Extract authorization code from URL and handle OAuth flow
    - Dispatch login action and redirect to dashboard on success
    - Pass error state and callbacks to CallbackView

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

    function backToHomeACB() {
        window.location.href = window.location.origin;
    }

    return (
        <CallbackView
            error={error}
            onBackToHome={backToHomeACB}
        />
    );
}

