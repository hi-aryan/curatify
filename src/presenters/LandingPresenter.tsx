"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  setSelectedCountry,
  addToPlaylist,
  removeFromPlaylist,
  reorderPlaylist,
} from "../store/chartsSlice";
import { redirectToSpotifyAuth } from "../api/spotifyAuth";
import { RootState } from "../store/store";
import { LandingView } from "../views/LandingView";
import { getCountryTracks } from "../data/nordicCharts";

/*
    LandingPresenter: connects Redux store to LandingView
    
    Pattern: 
    - Read state from Redux with useSelector
    - Define ACB functions that dispatch actions or handle navigation
    - Pass state and ACBs to View as props
*/
export function LandingPresenter() {
  const dispatch = useDispatch();
  const router = useRouter();

  const selectedCountry = useSelector(
    (state: RootState) => state.charts.selectedCountry
  );
  const dummyPlaylist = useSelector(
    (state: RootState) => state.charts.dummyPlaylist
  );
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const isMobile = useSelector((state: RootState) => state.ui.isMobile);

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
    router.push("/dashboard");
  }

  function navigateToAboutACB() {
    router.push("/about");
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
      onNavigateToAbout={navigateToAboutACB}
      isMobile={isMobile}
    />
  );
}
