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
    <div className="min-h-screen">
      {/* Hero section */}
      <header className="p-8 flex justify-between items-start">
        <h1 className="text-4xl font-bold">Curatify</h1>
        {props.isLoggedIn ? (
          <Button
            onClick={navigateToDashboardHandlerACB}
            variant="outline"
            className="rounded-full border-green/50 text-green hover:bg-green/10 hover:rotate-1 hover:scale-105 transition-all duration-200"
          >
            Go to Dashboard
          </Button>
        ) : (
          <div className="flex flex-col items-end text-right">
            <Button
              onClick={loginClickHandlerACB}
              variant="outline"
              className="rounded-full border-green/50 text-green hover:bg-green/10 hover:rotate-1 hover:scale-105 transition-all duration-200"
            >
              Sign in with Spotify
            </Button>
            <p className="text-xs text-light/50 mt-2 max-w-[35ch]">
              currently only whitelisted users allowed; contact aryanleo055@gmail.com for whitelist
            </p>
          </div>
        )}
      </header>

      {/* Main content */}
      <section className="px-8 pb-8">
        {/* Nordic Map - Centerpiece with 3D effect */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold text-light mb-2">Nordic Charts</h2>
          <p className="text-light/50 mb-8">
            Click a country to explore its top songs
          </p>

          <CardContainer className="w-full max-w-3xl" containerClassName="py-0">
            <CardBody className="w-full h-auto">
              <CardItem translateZ="80" className="w-full">
                <NordicMap
                  selectedCountry={props.selectedCountry}
                  onCountryClick={props.onCountryClick}
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        {/* Playlist Maker Cards - Below Map */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Country Songs List - drag source */}
          <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {props.selectedCountry
                  ? `Top 50 - ${COUNTRY_NAMES[props.selectedCountry]}`
                  : "Select a Country"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {props.selectedCountry ? (
                <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2">
                  {props.countryTracks.map(renderSongCardCB)}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-light/50">
                  <p>Click a country on the map to see its top songs</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Playlist Builder - drop target */}
          <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow">
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
