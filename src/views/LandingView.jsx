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
import {
  CardBody,
  CardContainer,
  CardItem,
} from "../components/ui/3d-card.jsx";

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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Hero section - compact */}
      <header className="px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Curatify</h1>
          <p className="text-sm opacity-70">Discover Nordic music charts</p>
        </div>
        {props.isLoggedIn ? (
          <Button
            onClick={navigateToDashboardHandlerACB}
            variant="outline"
            className="rounded-full border-green/50 text-green hover:bg-green/10 hover:scale-105 transition-all duration-200"
          >
            Go to Dashboard
          </Button>
        ) : (
          <Button
            onClick={loginClickHandlerACB}
            variant="outline"
            className="rounded-full border-green/50 text-green hover:bg-green/10 hover:scale-105 transition-all duration-200"
          >
            Sign in with Spotify
          </Button>
        )}
      </header>

      {/* Main content - side by side */}
      <section className="flex-1 px-8 pb-4 flex gap-8 min-h-0">
        {/* Nordic Map - Left side */}
        <div className="flex-1 flex flex-col items-center min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green/20 text-green text-xs font-bold">
              1
            </span>
            <p className="text-lg font-semibold">Click a country to explore</p>
          </div>
          <CardContainer
            className="flex-1 w-full"
            containerClassName="py-0 h-full"
          >
            <CardBody className="w-full h-full flex items-center justify-center">
              <CardItem translateZ="80" className="max-h-full">
                <NordicMap
                  selectedCountry={props.selectedCountry}
                  onCountryClick={props.onCountryClick}
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        {/* Playlist Cards - Right side */}
        <div className="w-96 flex flex-col gap-4 min-h-0">
          {/* Country Songs List */}
          <Card className="flex-1 min-h-0 flex flex-col border-light/40 bg-dark/40">
            <CardHeader className="py-2 lg:py-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green/20 text-green text-xs font-bold">
                  2
                </span>
                <CardTitle className="text-base lg:text-lg font-semibold">
                  {props.selectedCountry
                    ? `Top 50 - ${COUNTRY_NAMES[props.selectedCountry]}`
                    : "Browse top songs"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-3">
              {props.selectedCountry ? (
                <div className="h-full overflow-y-auto space-y-1.5 pr-2">
                  {props.countryTracks.map(renderSongCardCB)}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-light/50 text-sm">
                  <p>Click a country on the map</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Playlist Builder */}
          <Card className="flex-1 min-h-0 flex flex-col border-light/40 bg-dark/40">
            <CardHeader className="py-2 lg:py-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green/20 text-green text-xs font-bold">
                  3
                </span>
                <CardTitle className="text-lg font-semibold">
                  Drop to create playlist
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-3">
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
