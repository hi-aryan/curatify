import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; /* instead of mobx observer and mobx actions */
import { logout, setTopArtist } from '../store/userSlice.js';
import { clearTokenData } from '../api/spotifyAuth.js';
import { DashboardView } from '../views/DashboardView.jsx';
import { getUserTopArtists } from '../api/spotifySource.js';

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

    useEffect(() => {
        if (!accessToken || topArtist) {
            return;
        }

        async function fetchTopArtistACB() {
            try {
                const response = await getUserTopArtists(accessToken, { limit: 1 });
                const favorite = response?.items?.[0];

                if (favorite) {
                    dispatch(setTopArtist({
                        name: favorite.name,
                        image: favorite.images?.[0]?.url || null,
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch top artist:', error);
            }
        }

        fetchTopArtistACB();
    }, [accessToken, topArtist, dispatch]);

    function logoutACB() {
        clearTokenData();
        dispatch(logout());
        window.location.href = window.location.origin;
    }

    return (
        <DashboardView
            profile={profile}
            favoriteArtist={topArtist}
            onLogout={logoutACB}
        />
    );
}

