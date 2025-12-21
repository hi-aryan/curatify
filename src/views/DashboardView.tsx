/*
    DashboardView: Quick overview dashboard for authenticated users
    
    Displays:
    - Welcome message with profile
    - Favorite artist showcase
    - Top 3 tracks preview
    - Favorite genre
    - Quick links to other tools
    - Friends management button
    
    Props:
    - profile: user's Spotify profile
    - favoriteArtist: top artist info { name, image, url }
    - topTracks: array of top 3 tracks from Spotify
    - topGenre: favorite genre calculated from top 50 tracks
    - onLogout: callback when user logs out
    - onNavigateToLanding: callback to go to landing page
    - onNavigateToAbout: callback to go to about page
    - onFriendsOpen: callback to open friends modal
    - isFriendsOpen: whether friends modal is open
    - friendInput: current friend search input
    - searchResults: array of search results
    - followedUsers: array of followed users
    - onFriendInputChange: callback when search input changes
    - onSearchUsers: callback to search for users
    - onAddFriend: callback to add friend
    - onUnfollowUser: callback to unfollow user
    - followLoading: whether follow operation is in progress
    - followError: error message if follow operation failed
    - searchLoading: whether search is in progress
*/

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfiniteTrackScroll } from "@/components/InfiniteTrackScroll";
import { Music, BarChart2, ListMusic, Settings, Sparkles, Mic, Library, Users, Brain, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardViewProps {
  profile: any;
  favoriteArtist: any;
  topTracks: any[];
  topArtists: any[];
  topGenre: string;
  onLogout: () => void;
  onNavigateToLanding: () => void;
  onNavigateToAbout: () => void;
  playlists: any[];
  selectedPlaylistId: string;
  onPlaylistSelect: (id: string) => void;
  onAnalyzePlaylist: () => void;
  moodboardAnalysis: any;
  moodboardLoading: boolean;
  moodboardError: string | null;
  followedUsers: any[];
  followLoading: boolean;
  followError: string | null;
  isFriendsOpen: boolean;
  friendInput: string;
  onFriendsOpen: (open: boolean) => void;
  onFriendInputChange: (val: string) => void;
  onSearchUsers: (e: React.FormEvent) => void;
  searchResults: any[];
  searchLoading: boolean;
  onAddFriend: (name: string) => void;
  onUnfollowUser: (id: number) => void;
  genreLoading: boolean;
  // Analysis Props
  hasQuiz: boolean;
  deepAnalysis: any;
  analysisLoading: boolean;
  analysisError: string | null;
  onTriggerAnalysis: () => void;
}

export function DashboardView(props: DashboardViewProps) {
  return (
    <div className="space-y-8 max-w-full w-full min-w-0 overflow-x-hidden">
      {/* Header with user profile and favorite artist */}
      <header>
        <div className="flex flex-wrap gap-8 justify-between items-start mb-6">
          {/* Left: Profile info */}
          <div className="flex items-center gap-4">
            {props.profile?.external_urls?.spotify ? (
              <a
                href={props.profile.external_urls.spotify}
                target="_blank"
                rel="noreferrer"
                className="transition-transform duration-200 hover:scale-105"
              >
                {props.profile?.images?.[0]?.url ? (
                  <img
                    src={props.profile.images[0].url}
                    alt={props.profile.display_name || "Profile"}
                    className="w-12 h-12 rounded-full object-cover border border-light/40 cursor-pointer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-light/20 flex items-center justify-center border border-light/20 text-sm cursor-pointer">
                    👤
                  </div>
                )}
              </a>
            ) : (
              <div className="transition-transform duration-200 hover:scale-105">
                {props.profile?.images?.[0]?.url ? (
                  <img
                    src={props.profile.images[0].url}
                    alt={props.profile.display_name || "Profile"}
                    className="w-12 h-12 rounded-full object-cover border border-light/40"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-light/20 flex items-center justify-center border border-light/20 text-sm">
                    👤
                  </div>
                )}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">
                Welcome, {props.profile?.display_name || "User"}
              </h1>
              <p className="text-sm opacity-70">{props.profile?.email}</p>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => props.onFriendsOpen(true)}
              className="bg-green/10 text-green rounded-full border-2 border-green/50 hover:bg-green/20 transition-all duration-300 font-bold flex items-center gap-2 px-6 shadow-[0_0_15px_rgba(108,227,149,0.1)] group/friends"
            >
              <Users size={18} className="group-hover/friends:scale-110 transition-transform duration-300" />
              <span>Friends</span>
            </Button>
          </div>
        </div>

        {/* Favorite artist and genre row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Favorite Artist */}
          <div className="flex items-center gap-4 p-4 rounded-lg border border-light/10 bg-gradient-to-br from-white/[0.05] to-transparent group hover:border-green/30 hover:shadow-xl hover:shadow-green/[0.05] transition-all duration-300 relative overflow-hidden h-24">
            <div className="absolute right-[-10px] top-[-10px] opacity-[0.02] group-hover:opacity-[0.07] transition-opacity duration-300 transform rotate-12 pointer-events-none">
              <Mic size={100} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              {props.favoriteArtist?.image &&
                (props.favoriteArtist?.url ? (
                  <a
                    href={props.favoriteArtist.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block transition-opacity hover:opacity-80"
                  >
                    <img
                      src={props.favoriteArtist.image}
                      alt={props.favoriteArtist.name}
                      className="w-14 h-14 rounded-full object-cover border border-light/40 group-hover:scale-110 transition-transform duration-500"
                    />
                  </a>
                ) : (
                  <img
                    src={props.favoriteArtist.image}
                    alt={props.favoriteArtist.name}
                    className="w-14 h-14 rounded-full object-cover border border-light/40"
                  />
                ))}
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-0.5">
                  Favourite artist
                </p>
                <p className="text-xl font-bold tracking-tight">
                  {(props.favoriteArtist?.name || "Not available")
                    .split("")
                    .map((char, index) => (
                      <span
                        key={`${char}-${index}`}
                        className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-green"
                        style={{ transitionDelay: `${index * 20}ms` }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                </p>
              </div>
            </div>
          </div>

          {/* Favorite Genre */}
          <div className="flex items-center justify-center p-4 rounded-lg border border-light/10 bg-gradient-to-br from-white/[0.05] to-transparent group hover:border-green/30 hover:shadow-xl hover:shadow-green/[0.05] transition-all duration-300 relative overflow-hidden h-24">
            <div className="absolute left-[-10px] bottom-[-10px] opacity-[0.02] group-hover:opacity-[0.07] transition-opacity duration-300 transform -rotate-12 pointer-events-none">
              <Library size={100} />
            </div>
            <div className="text-center relative z-10">
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">
                Favourite genre
              </p>
              <p className="text-2xl font-bold capitalize tracking-tight">
                {(props.genreLoading
                  ? "Calculating..."
                  : props.topGenre || "Not available"
                )
                  .split("")
                  .map((char, index) => (
                    <span
                      key={`${char}-${index}`}
                      className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-green"
                      style={{ transitionDelay: `${index * 20}ms` }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Friends Modal */}
      {props.isFriendsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => props.onFriendsOpen(false)}
        >
          <div
            className="bg-dark border border-light/20 rounded-xl p-6 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Friends</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => props.onFriendsOpen(false)}
                className="hover:bg-red-500/10 hover:text-red-400"
              >
                Close
              </Button>
            </div>

            {/* Search Form */}
            <form onSubmit={props.onSearchUsers} className="flex gap-2 mb-4">
              <input
                type="text"
                value={props.friendInput}
                onChange={(e) => props.onFriendInputChange(e.target.value)}
                placeholder="Search username..."
                className="flex-1 bg-light/5 border border-light/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-green/50 transition-colors"
              />
              <Button
                type="submit"
                disabled={!props.friendInput.trim() || props.searchLoading}
                className="bg-green hover:bg-green/90 text-dark font-medium"
              >
                {props.searchLoading ? "..." : "Search"}
              </Button>
            </form>
            {props.followError && (
              <p className="text-red-400 text-xs mb-4 -mt-2">
                {props.followError}
              </p>
            )}

            {/* Search Results */}
            {props.searchResults && props.searchResults.length > 0 && (
              <div className="mb-6 border-b border-light/10 pb-4">
                <h3 className="text-sm uppercase tracking-wide opacity-50 mb-2">
                  Search Results
                </h3>
                <div className="space-y-2">
                  {props.searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 rounded bg-light/5 border border-light/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green/20 flex items-center justify-center text-green text-[10px]">
                          {user.name?.charAt(0) || "?"}
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs hover:bg-green/20 hover:text-green"
                        disabled={props.followLoading}
                        onClick={() => props.onAddFriend(user.name)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Following List */}
            <div>
              <h3 className="text-sm uppercase tracking-wide opacity-50 mb-3">
                Following ({props.followedUsers?.length || 0})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {props.followedUsers && props.followedUsers.length > 0 ? (
                  props.followedUsers.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-light/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-xs">
                        {friend.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{friend.name}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-light/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        onClick={() => props.onUnfollowUser(friend.id)}
                      >
                        Unfollow
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm opacity-40 italic">
                    You are not following anyone yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deep Analysis Spotlight */}
      {props.hasQuiz && (
        <section className="animate-in slide-in-from-bottom-4 duration-700">
          <Card className="overflow-hidden border-2 border-green/20 bg-dark/40 shadow-2xl relative">
            
            <CardHeader className="border-b border-light/5 py-4 px-6 flex flex-row items-center justify-between bg-dark/20 backdrop-blur-sm relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green/10 text-green">
                  <BarChart2 size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Deep Music Analysis</CardTitle>
                </div>
              </div>
              {!props.deepAnalysis && !props.analysisLoading && (
                <Button 
                   onClick={props.onTriggerAnalysis}
                   className="bg-green hover:bg-green/90 text-dark font-bold rounded-full h-9 px-6 animate-pulse hover:animate-none"
                >
                  Reveal Insights
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-0 relative z-10">
              {props.analysisLoading ? (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-green/20 border-t-green animate-spin" />
                    <BarChart2 className="absolute inset-0 m-auto text-green animate-pulse" size={24} />
                  </div>
                  <p className="text-lg font-medium text-green animate-pulse">
                    {props.analysisLoading && !props.deepAnalysis ? "Consulting the Music Psychologist..." : "Identifying your profile..."}
                  </p>
                  <p className="text-sm opacity-50 max-w-xs">
                    {props.analysisLoading && !props.deepAnalysis 
                      ? "Connecting your personality quiz responses with your listening patterns."
                      : "We're syncing your Nordic vibe with your account data."}
                  </p>
                </div>
              ) : props.analysisError ? (
                 <div className="p-12 text-center">
                    <p className="text-red-400 mb-4">{props.analysisError}</p>
                    <Button variant="outline" onClick={props.onTriggerAnalysis}>Try Again</Button>
                 </div>
              ) : props.deepAnalysis ? (
                <div className="p-6 grid gap-6 lg:grid-cols-[200px_1fr]">
                  {/* Left: Archetype (Smaller) */}
                  <div className="flex flex-col items-center justify-center text-center space-y-3 border-b lg:border-b-0 lg:border-r border-light/5 pb-6 lg:pb-0 lg:pr-6">
                    <div className="w-24 h-24 rounded-full bg-green/10 flex items-center justify-center border-2 border-green/20">
                       <Music size={32} className="text-green" />
                    </div>
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest text-green font-bold">Archetype</h3>
                      <p className="text-2xl font-black tracking-tight">
                        {props.deepAnalysis.archetype}
                      </p>
                    </div>
                  </div>

                  {/* Right: Metrics & Profile */}
                  <div className="space-y-8">
                    <div className="grid gap-6 sm:grid-cols-3">
                      {props.deepAnalysis.metrics.map((m: any, idx: number) => (
                        <div key={idx} className="space-y-3 p-4 rounded-xl bg-light/[0.03] border border-light/5 hover:bg-light/[0.05] transition-all group">
                          <div className="flex justify-between items-center bg-transparent">
                            <span className="text-xs font-bold text-light/40 group-hover:text-green transition-colors">{m.label}</span>
                            <span className="text-sm font-black text-green">{m.value}%</span>
                          </div>
                          <Progress value={m.value} className="h-1 bg-dark/50" indicatorClassName="bg-green" />
                          <p className="text-[10px] leading-relaxed opacity-50">{m.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-green/5 border border-green/10 rounded-2xl p-6 relative overflow-hidden group">
                      <Info className="absolute top-4 right-4 text-green/20 group-hover:text-green/40 transition-colors" size={24} />
                      <h4 className="text-sm font-bold text-green mb-3 flex items-center gap-2">
                         The Psychological Core
                      </h4>
                      <p className="text-sm lg:text-base leading-relaxed text-light/80 italic font-medium">
                        "{props.deepAnalysis.profile}"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-light/5">
                  <div className="space-y-1 text-center lg:text-left">
                     <h3 className="text-lg font-bold">Uncover your Hidden Profile</h3>
                     <p className="text-xs text-light/50 max-w-sm">Comparing your Nordic vibe with your Spotify history.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="hidden sm:flex -space-x-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-10 h-10 rounded-full border-2 border-dark bg-dark/20 flex items-center justify-center">
                            <Music size={14} className="opacity-40" />
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Main content - Top tracks preview */}
      <main className="overflow-x-hidden max-w-full">
        <h2 className="text-2xl font-bold mb-4">Your Top Tracks</h2>
        <InfiniteTrackScroll tracks={props.topTracks} />

        {/* Quick links to tools */}
        <div className="mt-12 mb-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent hover:border-green/50 hover:shadow-2xl hover:shadow-green/[0.1] transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-300 transform rotate-12 pointer-events-none">
                <Sparkles size={120} />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold tracking-tight">
                  Song Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end relative z-10">
                <Button
                  className="w-full bg-white/10 hover:bg-green/80 hover:text-dark border-0 backdrop-blur-sm transition-all duration-300 font-semibold"
                  onClick={() =>
                    (window.location.href = "/dashboard/recommender")
                  }
                >
                  Discover
                </Button>
              </CardContent>
            </Card>

            <Card className="border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent hover:border-green/50 hover:shadow-2xl hover:shadow-green/[0.1] transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-300 transform rotate-12 pointer-events-none">
                <BarChart2 size={120} />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold tracking-tight">
                  Analyze Your Playlists
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end relative z-10">
                <Button
                  className="w-full bg-white/10 hover:bg-green/80 hover:text-dark border-0 backdrop-blur-sm transition-all duration-300 font-semibold"
                  onClick={() =>
                    (window.location.href = "/dashboard/playlist-stats")
                  }
                >
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card className="border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent hover:border-green/50 hover:shadow-2xl hover:shadow-green/[0.1] transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-300 transform rotate-12 pointer-events-none">
                <Music size={120} />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold tracking-tight">
                  Your Listening Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end relative z-10">
                <Button
                  className="w-full bg-white/10 hover:bg-green/80 hover:text-dark border-0 backdrop-blur-sm transition-all duration-300 font-semibold"
                  onClick={() => (window.location.href = "/dashboard/my-stats")}
                >
                  View Stats
                </Button>
              </CardContent>
            </Card>

            <Card className="border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent hover:border-green/50 hover:shadow-2xl hover:shadow-green/[0.1] transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-300 transform rotate-12 pointer-events-none">
                <ListMusic size={120} />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold tracking-tight">
                  Sort Your Playlists
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end relative z-10">
                <Button
                  className="w-full bg-white/10 hover:bg-green/80 hover:text-dark border-0 backdrop-blur-sm transition-all duration-300 font-semibold"
                  onClick={() => (window.location.href = "/dashboard/sorter")}
                >
                  Sort
                </Button>
              </CardContent>
            </Card>

            <Card className="border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent hover:border-green/50 hover:shadow-2xl hover:shadow-green/[0.1] transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-300 transform rotate-12 pointer-events-none">
                <Settings size={120} />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold tracking-tight">
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end relative z-10">
                <Button
                  className="w-full bg-white/10 hover:bg-green/80 hover:text-dark border-0 backdrop-blur-sm transition-all duration-300 font-semibold"
                  onClick={() => (window.location.href = "/dashboard/settings")}
                >
                  Configure
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
