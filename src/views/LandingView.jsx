/*
    LandingView: the public landing page
    
    Displays:
    - Hero section with login or dashboard navigation
    - Nordic map with chart data
    - Country top songs (drag source)
    - Playlist creator (drop target)
    
    Props:
    - selectedCountry: currently selected country code
    - countryTracks: array of tracks for the selected country
    - dummyPlaylist: array of tracks in the playlist builder
    - onCountryClick: callback when user clicks a country
    - onAddToPlaylist: callback when user adds a track
    - onRemoveFromPlaylist: callback when user removes a track
    - onReorderPlaylist: callback when user reorders the playlist
    - isLoggedIn: whether user is authenticated
    - onLoginClick: callback when user clicks sign in
    - onNavigateToDashboard: callback when user clicks go to dashboard
*/
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NordicMap } from "../components/NordicMap.jsx";
import { SongCard } from "../components/SongCard.jsx";
import { PlaylistDropZone } from "../components/PlaylistDropZone.jsx";
import { COUNTRY_NAMES } from "../data/nordicCharts.js";

export function LandingView(props) {
  function loginClickHandlerACB() {
    props.onLoginClick();
  }

  function navigateToDashboardHandlerACB() {
    props.onNavigateToDashboard();
  }

  function renderSongCardCB(track) {
    return <SongCard key={track.id} track={track} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <header className="p-8">
        <h1 className="text-4xl font-bold">Curatify</h1>
        <p className="mt-2 text-lg opacity-70">Discover Nordic music charts</p>
        {props.isLoggedIn ? (
          <Button
            onClick={navigateToDashboardHandlerACB}
            variant="outline"
            className="mt-4 rounded-full border-green/50 text-green hover:bg-green/10 hover:rotate-1 hover:scale-105 transition-all duration-200"
          >
            Go to Dashboard
          </Button>
        ) : (
          <Button
            onClick={loginClickHandlerACB}
            variant="outline"
            className="mt-4 rounded-full border-green/50 text-green hover:bg-green/10 hover:rotate-1 hover:scale-105 transition-all duration-200"
          >
            Sign in with Spotify
          </Button>
        )}
      </header>

      {/* Main content: Map + Songs + Playlist */}
      <section className="p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Nordic Map */}
          <Card className="border-light/40 bg-dark/40">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Nordic Charts
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <NordicMap
                selectedCountry={props.selectedCountry}
                onCountryClick={props.onCountryClick}
              />
            </CardContent>
          </Card>

          {/* Country Songs List */}
          <Card className="border-light/40 bg-dark/40">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {props.selectedCountry
                  ? `Top 50 - ${COUNTRY_NAMES[props.selectedCountry]}`
                  : "Select a Country"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {props.selectedCountry ? (
                <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                  {props.countryTracks.map(renderSongCardCB)}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-light/50">
                  <p>Click a country on the map to see its top songs</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Playlist Builder */}
          <Card className="border-light/40 bg-dark/40">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Your Playlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PlaylistDropZone
                playlist={props.dummyPlaylist}
                onAddTrack={props.onAddToPlaylist}
                onRemoveTrack={props.onRemoveFromPlaylist}
                onReorder={props.onReorderPlaylist}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
