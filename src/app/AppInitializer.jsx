'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getValidAccessToken } from '../api/spotifyAuth.js';
import { getUserProfile } from '../api/spotifySource.js';
import { login } from '../store/userSlice.js';
import { SuspenseView } from '../views/SuspenseView.jsx';

export default function AppInitializer({ children }) {
    const dispatch = useDispatch();
    const [isRestoring, setIsRestoring] = useState(true);

    useEffect(() => {
        async function restoreSessionACB() {
            try {
                const accessToken = await getValidAccessToken();
                if (accessToken) {
                    const profile = await getUserProfile(accessToken);
                    dispatch(login({ profile }));
                }
            } catch (error) {
                // Suppress expected error for guest users
                if (error.message !== "No refresh token available") {
                    console.error("Session restoration failed:", error);
                }
            } finally {
                setIsRestoring(false);
            }
        }
        restoreSessionACB();
    }, [dispatch]);

    if (isRestoring) {
        return <SuspenseView promise={{}} error={null} />;
    }

    return <>{children}</>;
}
