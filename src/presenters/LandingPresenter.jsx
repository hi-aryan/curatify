import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setSelectedCountry,
  addToPlaylist,
  removeFromPlaylist,
  reorderPlaylist,
} from "../store/chartsSlice.js";
import { redirectToSpotifyAuth } from "../api/spotifyAuth.js";
import { LandingView } from "../views/LandingView.jsx";
import { getCountryTracks } from "../data/nordicCharts.js";

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

  const selectedCountry = useSelector((state) => state.charts.selectedCountry);
  const dummyPlaylist = useSelector((state) => state.charts.dummyPlaylist);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Get tracks for the selected country from local CSV data
  const countryTracks = selectedCountry
    ? getCountryTracks(selectedCountry)
    : [];

  function countryClickACB(countryCode) {
    dispatch(setSelectedCountry(countryCode));
  }

  function addToPlaylistACB(track) {
    dispatch(addToPlaylist(track));
  }

  function removeFromPlaylistACB(trackId) {
    dispatch(removeFromPlaylist(trackId));
  }

  function reorderPlaylistACB(newOrder) {
    dispatch(reorderPlaylist(newOrder));
  }

  function loginClickACB() {
    redirectToSpotifyAuth();
  }

  function navigateToDashboardACB() {
    navigate("/dashboard");
  }

  return (
    <LandingView
      selectedCountry={selectedCountry}
      countryTracks={countryTracks}
      dummyPlaylist={dummyPlaylist}
      onCountryClick={countryClickACB}
      onAddToPlaylist={addToPlaylistACB}
      onRemoveFromPlaylist={removeFromPlaylistACB}
      onReorderPlaylist={reorderPlaylistACB}
      isLoggedIn={isLoggedIn}
      onLoginClick={loginClickACB}
      onNavigateToDashboard={navigateToDashboardACB}
    />
  );
}
