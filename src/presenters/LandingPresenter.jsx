import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedCountry } from '../store/chartsSlice.js';
import { redirectToSpotifyAuth } from '../api/spotifyAuth.js';
import { LandingView } from '../views/LandingView.jsx';

/*
    LandingPresenter: connects Redux store to LandingView
    
    Pattern: 
    - Read state from Redux with useSelector
    - Define ACB functions that dispatch actions or handle navigation
    - Pass state and ACBs to View as props
*/
export function LandingPresenter() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    /* get the selected country from the charts slice (gets entire state object and extracts the selected country) */
    const selectedCountry = useSelector((state) => state.charts.selectedCountry);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    function countryHoverACB(countryCode) {
        dispatch(setSelectedCountry(countryCode));
    }

    function loginClickACB() {
        redirectToSpotifyAuth();
    }

    function navigateToDashboardACB() {
        navigate('/dashboard');
    }

    return (
        <LandingView
            selectedCountry={selectedCountry}
            onCountryHover={countryHoverACB}
            isLoggedIn={isLoggedIn}
            onLoginClick={loginClickACB}
            onNavigateToDashboard={navigateToDashboardACB}
        />
    );
}

