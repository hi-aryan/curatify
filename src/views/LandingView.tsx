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
import { InfiniteTrackScroll } from "@/components/InfiniteTrackScroll";
import { Music, ListPlus, LayoutDashboard } from "lucide-react";
import { IconBrandSpotify } from "@tabler/icons-react";
import { QuizModal } from "@/components/QuizModal";
import { NordicMap } from "../components/NordicMap";
import { SongCard } from "../components/SongCard";
import { PlaylistDropZone } from "../components/PlaylistDropZone";
import { COUNTRY_NAMES } from "../data/nordicCharts";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import { useState } from "react";



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
  onNavigateToAbout: () => void;
  // Quiz Props
  quizState: {
    showQuiz: boolean;
    currentQuestion: any;
    step: number;
    totalSteps: number;
    completed: boolean;
    showRecallTab: boolean;
  };
  onQuizAnswer: (answer: string) => void;
  onQuizClose: () => void;
  onQueueAll: () => void;
}

function DemoVideo() {
  return (
    <div className="w-[400px] aspect-video rounded-xl overflow-hidden border border-light/20 shadow-2xl bg-dark">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/AyMqBULE5wc?autoplay=1&mute=1&controls=0&loop=1&playlist=AyMqBULE5wc&modestbranding=1&rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        className="object-cover"
      ></iframe>
    </div>
  );
}

function VideoHover({ isVisible, variant = 'dropdown' }: { isVisible: boolean, variant?: 'dropdown' | 'side' }) {
  if (variant === 'side') {
    return (
      <div className="absolute top-1/2 left-full ml-6 -translate-y-1/2 z-[60]">
        <div className={`transition-all duration-500 origin-left ${
          isVisible ? "opacity-100 scale-100 translate-x-0 pointer-events-auto" : "opacity-0 scale-90 -translate-x-4 pointer-events-none"
        }`}>
          <DemoVideo />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`absolute top-full right-0 origin-top-right pt-4 z-[60] transition-all duration-500 ${
        isVisible ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
      }`}
    >
      <DemoVideo />
    </div>
  );
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
  onNavigateToAbout,
  quizState,
  onQuizAnswer,
  onQuizClose,
  onQueueAll,
}: LandingViewProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

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
      {/* Header - Minimal: Logo + Auth CTA */}
      <header className="px-4 py-4 lg:px-8 flex items-center justify-between shrink-0 relative z-50 bg-dark/20 backdrop-blur-sm border-b border-transparent">
        <div className="flex items-center gap-2">

          <span className="text-xl lg:text-2xl font-bold tracking-tight">Curatify</span>
        </div>

        <div>
          {isLoggedIn ? (
            <Button
              onClick={navigateToDashboardHandlerACB}
              variant="outline"
              className="rounded-full border-2 border-green/50 bg-green/10 text-green hover:bg-green/20 hover:scale-105 active:scale-95 transition-all duration-300 font-bold flex items-center gap-2 px-6 group/dash shadow-sm"
            >
              <LayoutDashboard size={18} className="group-hover/dash:scale-110 transition-transform duration-300" />
              <span className="uppercase tracking-wider">Go to Dashboard</span>
            </Button>
          ) : (
            <div 
              className="relative group/login"
              onMouseEnter={() => setHoveredButton('header')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Button
                onClick={loginClickHandlerACB}
                variant="outline"
                className="rounded-full border-2 border-green/50 bg-green/10 text-green hover:bg-green/20 hover:scale-105 active:scale-95 transition-all duration-300 font-bold flex items-center gap-2 px-6 group/spotify shadow-sm"
              >
                <IconBrandSpotify size={20} className="group-hover/spotify:scale-110 transition-transform duration-300" />
                <span className="uppercase tracking-wider">Sign in with Spotify</span>
              </Button>
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 text-[10px] uppercase tracking-widest bg-dark border border-light/10 rounded-lg text-light/70 font-medium whitespace-nowrap opacity-0 group-hover/login:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-sm">
                ✦ whitelist only
              </span>
              <VideoHover isVisible={hoveredButton === 'header'} />
            </div>
          )}
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
            <CardBody className="w-full h-full flex items-center justify-center lg:scale-110 xl:scale-125 2xl:scale-150 transition-transform duration-500 ease-in-out">
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
          <Card className={`h-[400px] lg:h-0 lg:flex-1 flex flex-col border-light/40 bg-dark/40 min-h-0 transition-all duration-500 overflow-hidden relative ${quizState.completed ? 'opacity-40 blur-[2px] pointer-events-none' : ''}`}>
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
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green/20 text-green text-xs font-bold">
                    3
                  </span>
                  <CardTitle className="text-base lg:text-lg font-semibold">
                    {dummyPlaylist.length > 0
                      ? "Your Playlist"
                      : "Tap + on songs to add"}
                    <span className="hidden lg:inline ml-1">
                      - Drop to create
                    </span>
                  </CardTitle>
                </div>

                {dummyPlaylist.length > 0 && (
                  <div 
                    className="relative"
                    onMouseEnter={() => setHoveredButton('queue')}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <Button
                      onClick={onQueueAll}
                      variant="outline"
                      size="sm"
                      className={`h-8 rounded-full font-bold text-[10px] lg:text-xs uppercase tracking-wider gap-2 transition-all duration-300 group/queue shadow-sm shrink-0 ${
                        isLoggedIn 
                          ? "bg-green text-dark border-transparent hover:bg-green/90 hover:text-dark hover:scale-[1.02] active:scale-[0.98]" 
                          : "bg-green/10 text-green border-green/50 hover:bg-green/20 hover:text-green hover:scale-[1.02]"
                      }`}
                    >
                      <ListPlus size={14} className="group-hover/queue:scale-110 transition-transform duration-300" />
                      <span>{isLoggedIn ? "Add to Queue" : "Sign in to Queue"}</span>
                    </Button>
                    {!isLoggedIn && (
                       <VideoHover isVisible={hoveredButton === 'queue'} />
                    )}
                  </div>
                )}
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

      {/* Footer - Minimal Navigation */}
      <footer className="px-4 py-3 lg:px-8 border-t border-light/5 bg-dark/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs lg:text-sm text-light/50">
        <p>© 2025 Curatify.</p>
        
        <nav className="flex items-center gap-6">
          <button 
            onClick={navigateToAboutHandlerACB}
            className="hover:text-green transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => {/* TODO: Features */}}
            className="hover:text-green transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => {/* TODO: Contact */}}
            className="hover:text-green transition-colors"
          >
            Contact
          </button>
        </nav>
      </footer>

      {/* Interactive Quiz Modal */}
      {quizState.showQuiz && (
        <QuizModal
          question={quizState.currentQuestion}
          step={quizState.step}
          totalSteps={quizState.totalSteps}
          onAnswer={onQuizAnswer}
          onClose={onQuizClose}
        />
      )}

      {/* Global Reveal Overlay */}
      {quizState.completed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={onQuizClose}
        >
          <Card 
            className="group w-full max-w-md bg-dark border-light/10 shadow-xl p-8 text-center relative pointer-events-auto animate-in slide-in-from-bottom-8 zoom-in-95 duration-500 visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Icon Asset - Clipped Container */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute -right-8 -top-8 text-green opacity-[0.03] group-hover:opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                   <Music size={240} />
                </div>
            </div>

             <button 
              onClick={onQuizClose}
              className="absolute top-4 right-4 text-light/20 hover:text-light transition-colors p-2 z-20"
            >
              ✕
            </button>

            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2 text-white">
                Analysis Ready!
              </h2>
              <p className="text-sm opacity-60 mb-8 leading-relaxed">
                We've blended your vibe with the charts. <br/>
                Ready to reveal your profile?
              </p>
  
              <div 
                className="relative w-fit mx-auto"
                onMouseEnter={() => setHoveredButton('quiz')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <Button 
                  onClick={onLoginClick}
                  className="w-fit h-12 px-10 bg-green hover:bg-green/90 text-dark font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(30,215,96,0.2)] active:scale-95 flex items-center justify-center"
                >
                  Reveal Insights
                </Button>
                <div className="absolute top-1/2 left-full ml-6 -translate-y-1/2">
                   {/* Combined VideoHover component handles positioning and animation for 'side' variant */}
                   <VideoHover isVisible={hoveredButton === 'quiz'} variant="side" />
                </div>
              </div>
  
              <button 
                onClick={onQuizClose}
                className="mt-6 text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                Explore the charts first
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Recall Handle - Visible when quiz is started but stashed */}
      {quizState.showRecallTab && (
        <button 
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 group flex items-stretch h-24"
          onClick={() => onQuizAnswer("RECALL")} 
        >
          {/* Subtle Handle */}
          <div className="w-3 bg-green/40 group-hover:bg-green group-hover:w-2 transition-all duration-300 rounded-r" />
          
          {/* Sliding Content */}
          <div className="bg-dark text-green px-2 py-4 rounded-r-lg font-bold text-[10px] [writing-mode:vertical-lr] uppercase tracking-widest flex items-center transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out border-y border-r border-light/10 bg-dark/80 backdrop-blur-sm">
            Analysis Resume
          </div>
        </button>
      )}
    </div>
  );
}
