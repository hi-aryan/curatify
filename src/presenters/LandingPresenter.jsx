import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCountry } from '../store/chartsSlice.js';
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
    const selectedCountry = useSelector((state) => state.charts.selectedCountry);

    function countryHoverACB(countryCode) {
        dispatch(setSelectedCountry(countryCode));
    }

    function loginClickACB() {
        // TODO: Implement Spotify OAuth flow
        console.log("Login clicked - implement Spotify OAuth");
    }

    return (
        <LandingView
            selectedCountry={selectedCountry}
            onCountryHover={countryHoverACB}
            onLoginClick={loginClickACB}
        />
    );
}

