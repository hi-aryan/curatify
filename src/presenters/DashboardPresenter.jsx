import { useSelector, useDispatch } from 'react-redux'; /* instead of mobx observer and mobx actions */
import { logout } from '../store/userSlice.js';
import { clearToken } from '../api/spotifyAuth.js';
import { DashboardView } from '../views/DashboardView.jsx';

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

    function logoutACB() {
        clearToken();
        dispatch(logout());
        window.location.href = window.location.origin;
    }

    return (
        <DashboardView
            profile={profile}
            onLogout={logoutACB}
        />
    );
}

