import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice.js';
import { getAccessToken } from '../api/spotifyAuth.js';
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
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");

            if (!code) {
                setError(new Error("No authorization code found"));
                return;
            }

            try {
                // getAccessToken exchanges code and stores all token data internally
                const accessToken = await getAccessToken(code);
                const profile = await getUserProfile(accessToken);

                dispatch(login({ profile, accessToken }));
                window.location.href = window.location.origin + "/#/dashboard";
            } catch (err) {
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

