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
import { NordicMap } from "../components/NordicMap";
import { SongCard } from "../components/SongCard";
import { PlaylistDropZone } from "../components/PlaylistDropZone";
import { COUNTRY_NAMES } from "../data/nordicCharts";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import logoImage from "@/assets/logo.png";
import Image from "next/image";

interface LandingViewProps {
  selectedCountry: string;
  countryTracks: any[];
  dummyPlaylist: any[];
  onCountryClick: (country: string) => void;
  onAddToPlaylist: (track: any) => void;
  onRemoveFromPlaylist: (track: any) => void;
  onReorderPlaylist: (tracks: any[]) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onNavigateToDashboard: () => void;
  isMobile: boolean;
  onNavigateToAbout: () => void;
}

export function LandingView({
  selectedCountry,
  countryTracks,
  dummyPlaylist,
  onCountryClick,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onReorderPlaylist,
  isLoggedIn,
  onLoginClick,
  onNavigateToDashboard,
  isMobile,
  onNavigateToAbout,
}: LandingViewProps) {
  function loginClickHandlerACB() {
    onLoginClick();
  }

  function navigateToDashboardHandlerACB() {
    onNavigateToDashboard();
  }

  function navigateToAboutHandlerACB() {
    onNavigateToAbout();
  }

  function renderSongCardCB(track) {
    return <SongCard key={track.id} track={track} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark/20 text-light overflow-y-auto lg:h-screen lg:overflow-hidden">
      {/* Navbar */}
      <header className="px-4 py-4 lg:px-4 flex items-center justify-between shrink-0">
        {/* Left: Logo + Brand + Desktop Links */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Home"
            className="flex items-center gap-2"
            onClick={() => {
              /* TODO: route to home */
            }}
          >
            <Image
              src={logoImage}
              alt="Curatify logo"
              className="h-12 w-12 rounded-md"
              priority
            />
            <span className="text-2xl font-bold">Curatify</span>
          </button>

          {/* Desktop nav links */}
          <NavigationMenu
            className="hidden lg:flex"
            aria-label="Primary navigation"
          >
            <NavigationMenuList className="justify-start">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button
                    type="button"
                    className="px-3 py-2 text-sm rounded-full border border-transparent text-light/90 hover:text-green hover:bg-green/10"
                    onClick={navigateToAboutHandlerACB}
                  >
                    About
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button
                    type="button"
                    className="px-3 py-2 text-sm rounded-full border border-transparent text-light/90 hover:text-green hover:bg-green/10"
                    onClick={() => {
                      /* TODO: route to Features */
                    }}
                  >
                    Features
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button
                    type="button"
                    className="px-3 py-2 text-sm rounded-full border border-transparent text-light/90 hover:text-green hover:bg-green/10"
                    onClick={() => {
                      /* TODO: route to Contact */
                    }}
                  >
                    Contact
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: CTA + Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Sign in / Dashboard */}
          {isLoggedIn ? (
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

          {/* Mobile menu trigger (hamburger) */}
          <NavigationMenu className="lg:hidden" aria-label="Mobile navigation">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="rounded-full border border-green/50 text-green bg-transparent hover:bg-green/10 p-2"
                  aria-label="Open menu"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-3 w-48">
                    <ul className="grid gap-1.5">
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            type="button"
                            className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-green/10"
                            onClick={navigateToAboutHandlerACB}
                          >
                            About
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            type="button"
                            className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-green/10"
                            onClick={() => {
                              /* TODO: route to Features */
                            }}
                          >
                            Features
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            type="button"
                            className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-green/10"
                            onClick={() => {
                              /* TODO: route to Contact */
                            }}
                          >
                            Contact
                          </button>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      {/* Main content - stacked on mobile, side-by-side on desktop */}
      <section className="flex-1 px-4 pb-8 lg:px-8 lg:pb-4 flex flex-col lg:flex-row gap-8 lg:gap-6 min-h-0">
        {/* Nordic Map - Top/Left side */}
        <div className="w-full lg:flex-1 flex flex-col items-center min-h-[400px] lg:min-h-0 lg:h-full">
          <div className="flex items-center gap-2 mb-8 lg:mb-0">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green/20 text-green text-xs font-bold">
              1
            </span>
            <p className="text-lg font-semibold">Click a country to explore</p>
          </div>
          <CardContainer
            className="flex-1 w-full"
            containerClassName="py-0 h-full"
          >
            <CardBody className="w-full h-full flex items-center justify-center lg:scale-150">
              <CardItem translateZ="80" className="max-h-full w-full">
                <NordicMap
                  selectedCountry={selectedCountry}
                  onCountryClick={onCountryClick}
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        {/* Playlist Cards - Bottom/Right side */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:gap-4 lg:h-full lg:min-h-0 ">
          {/* Country Songs List */}
          <Card className="h-[400px] lg:h-0 lg:flex-1 flex flex-col border-light/40 bg-dark/40 min-h-0">
            <CardHeader className="py-2 lg:py-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green/20 text-green text-xs font-bold">
                  2
                </span>
                <CardTitle className="text-base lg:text-lg font-semibold">
                  {selectedCountry
                    ? `Top 50 - ${COUNTRY_NAMES[selectedCountry]}`
                    : "Browse top songs"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-3 overflow-hidden flex flex-col">
              {selectedCountry ? (
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                  {countryTracks.map((track) => (
                    <SongCard
                      key={track.id}
                      track={track}
                      onAdd={onAddToPlaylist}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-light/50 text-sm">
                  <p>Click a country on the map</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Playlist Builder */}
          <Card className="h-[300px] lg:h-0 lg:flex-1 flex flex-col border-light/40 bg-dark/40 min-h-0">
            <CardHeader className="py-2 lg:py-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green/20 text-green text-xs font-bold">
                  3
                </span>
                <CardTitle className="text-lg font-semibold">
                  {dummyPlaylist.length > 0
                    ? "Your Playlist"
                    : "Tap + on songs to add"}
                  <span className="hidden lg:inline ml-1">
                    - Drop to create
                  </span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-3 overflow-hidden flex flex-col">
              <PlaylistDropZone
                playlist={dummyPlaylist}
                onAddTrack={onAddToPlaylist}
                onRemoveTrack={onRemoveFromPlaylist}
                onReorder={onReorderPlaylist}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
