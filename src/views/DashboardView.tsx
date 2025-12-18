/*
    DashboardView: the authenticated user's dashboard
    
    Displays personalized features:
    - Playlist sorting
    - Song recommendations from LLM
    - Personality review
    
    Props:
    - profile: user's Spotify profile
    - favoriteArtist: top artist info { name, image, url }
    - topTracks: array of top 3 tracks from Spotify
    - topArtists: array of top artists from Spotify
    - topGenre: favorite genre calculated from top 50 tracks
    - onLogout: callback when user logs out
    - onNavigateToLanding: callback when user clicks to go to landing page
    - geminiPrompt: current prompt input for Gemini test
    - geminiResponse: response text from Gemini API
    - geminiLoading: whether Gemini API call is in progress
    - geminiError: error message if Gemini API call failed
    - onGeminiPromptChange: callback when prompt input changes
    - onTestGemini: callback to trigger Gemini API test
    - playlists: array of user's playlists
    - selectedPlaylistId: currently selected playlist ID
    - onPlaylistSelect: callback when playlist is selected
    - onAnalyzePlaylist: callback to trigger playlist analysis
    - moodboardAnalysis: analysis result object
    - moodboardLoading: whether analysis is in progress
    - moodboardError: error message if analysis failed
*/

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoodboardCard } from "@/components/MoodboardCard";
import { ListPlus } from "lucide-react";

export function DashboardView(props) {
  function logoutClickHandlerACB() {
    props.onLogout();
  }

  function navigateToLandingHandlerACB() {
    props.onNavigateToLanding();
  }

  function navigateToAboutHandlerACB() {
    props.onNavigateToAbout();
  }

  return (
    <div className="min-h-screen">
      {/* Header with user info */}
      <header className="p-8 flex flex-wrap gap-6 justify-between items-center">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {props.profile?.images?.[0]?.url ? (
                <img
                  src={props.profile.images[0].url}
                  alt={props.profile.display_name || "Profile"}
                  className="w-12 h-12 rounded-full object-cover border border-light/40 cursor-pointer transition-transform duration-200 hover:scale-105"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-light/20 flex items-center justify-center border border-light/20 text-sm cursor-pointer">
                  👤
                </div>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuItem disabled>
                {props.profile?.display_name ?? "Account"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={navigateToLandingHandlerACB}>
                Home
              </DropdownMenuItem>
              <DropdownMenuItem onClick={navigateToAboutHandlerACB}>
                About
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logoutClickHandlerACB}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {props.profile?.display_name || "User"}
            </h1>
            <p className="text-sm opacity-70">{props.profile?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* conditionally render link if .url is available */}
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
                  className="w-12 h-12 rounded-full object-cover border border-light/40"
                />
              </a>
            ) : (
              <img
                src={props.favoriteArtist.image}
                alt={props.favoriteArtist.name}
                className="w-12 h-12 rounded-full object-cover border border-light/40"
              />
            ))}
          <div>
            <p className="text-xs uppercase tracking-wide opacity-70">
              Favourite artist
            </p>
            <p className="text-lg font-semibold group">
              {(props.favoriteArtist?.name || "Not available")
                .split("")
                .map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-green"
                    style={{ transitionDelay: `${index * 30}ms` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => props.onFriendsOpen(true)}
            variant="outline"
            className="hover:bg-green/10 hover:text-green hover:border-green/50 transition-all duration-200"
          >
            Friends
          </Button>
          <Button
            onClick={navigateToLandingHandlerACB}
            variant="outline"
            className="hover:-rotate-2 hover:scale-105 transition-all duration-200"
          >
            Home
          </Button>
        </div>
      </header>

      {/* Friends Modal Overlay */}
      {props.isFriendsOpen && (
        // ... existing friends modal content ...
        // Backdrop with click handler to close
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => props.onFriendsOpen(false)}
        >
          <div
            className="bg-dark border border-light/20 rounded-xl p-6 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent close on modal click
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
                        onClick={() => props.onAddFriend(user.name)} // Pass name or ID (presenter handles name logic currently)
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
                      {friend.spotifyId && (
                        <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-xs">
                          {friend.name?.charAt(0) || "?"}
                        </div>
                      )}
                      {/* Note: In a real app we would use friend.image if available. Schema has image_url, but userActions doesn't assume we have it populated always. */}
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

      {/* Queue Notification Popup */}
      {props.queueNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-dark border border-light/20 rounded-xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 text-center">
            {props.queueNotification.type === "success" ? (
              <div className="w-12 h-12 rounded-full bg-green/20 text-green flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            )}
            <h3 className="text-lg font-bold mb-2">
              {props.queueNotification.type === "success"
                ? "Success"
                : "Action Required"}
            </h3>
            <p className="text-light/70 text-sm mb-6">
              {props.queueNotification.message}
            </p>
            <Button
              onClick={props.onCloseQueueNotification}
              className={`w-full ${
                props.queueNotification.type === "success"
                  ? "bg-green hover:bg-green/90 text-dark"
                  : "bg-light/10 hover:bg-light/20 text-light"
              }`}
            >
              Okay
            </Button>
          </div>
        </div>
      )}

      {/* Features grid - placeholders */}
      <section className="p-8 grid gap-6 md:grid-cols-2">
        <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Sort Playlists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-light opacity-60">Coming soon...</p>
          </CardContent>
        </Card>

        <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center justify-between">
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!props.recommendations ? (
              <div className="text-center py-4">
                <p className="text-light opacity-60 mb-4">
                  Get custom song suggestions based on your statistics.
                </p>
                <Button
                  onClick={props.onGetRecommendations}
                  disabled={props.recLoading}
                  variant="outline"
                  className="w-full border-light/40 text-light/90 hover:bg-green/5 hover:border-green/60 hover:text-green/90 transition-all"
                >
                  {props.recLoading ? (
                    <span className="text-xs text-green animate-pulse">
                      Analyzing...
                    </span>
                  ) : (
                    "Get Suggestions"
                  )}
                </Button>
                {props.recError && (
                  <p className="text-red-400 text-xs mt-3">{props.recError}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {props.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-3 bg-light/5 rounded border border-light/10 hover:border-green/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-light">{rec.title}</h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          rec.type === "Safe Bet"
                            ? "border-blue-400/50 text-blue-300"
                            : rec.type === "Wild Card"
                            ? "border-purple-400/50 text-purple-300"
                            : "border-green/50 text-green"
                        }`}
                      >
                        {rec.type}
                      </span>
                    </div>
                    <p className="text-sm text-light/70 mb-2">{rec.artist}</p>
                    <p className="text-xs text-light/50 italic">
                      "{rec.reason}"
                    </p>
                  </div>
                ))}
                <Button
                  onClick={props.onGetRecommendations}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-light/40 hover:text-green mt-2"
                >
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <MoodboardCard
          playlists={props.playlists}
          selectedPlaylistId={props.selectedPlaylistId}
          onPlaylistSelect={props.onPlaylistSelect}
          onAnalyze={props.onAnalyzePlaylist}
          analysis={props.moodboardAnalysis}
          loading={props.moodboardLoading}
          error={props.moodboardError}
          onAddToQueue={props.onAddToQueue}
        />

        <CollapsibleCard
          className="hover:shadow-xl hover:shadow-green/[0.05] transition-shadow"
          title="Listening Statistics"
          peekContent={
            /* Top 3 Tracks - Always visible */
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm uppercase tracking-wide opacity-70">
                  Top 3 Tracks
                </h3>
                <span className="text-xs uppercase tracking-wide opacity-50">
                  Add to Spotify Queue
                </span>
              </div>
              {props.topTracks && props.topTracks.length > 0 ? (
                <div className="space-y-2">
                  {props.topTracks.map((track, index) => (
                    <div key={track.id} className="flex items-center gap-3">
                      <span className="text-xl font-bold text-light/40 w-6 text-center">
                        {index + 1}
                      </span>
                      {track.album?.images?.[2]?.url && (
                        <img
                          src={track.album.images[2].url}
                          alt={track.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <a
                          href={track.external_urls?.spotify}
                          target="_blank"
                          rel="noreferrer"
                          className="block font-semibold truncate transition-colors duration-150 hover:text-green"
                        >
                          {track.name}
                        </a>
                        <p className="text-sm opacity-70 truncate">
                          {track.artists?.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-light/50 hover:text-green hover:bg-green/10"
                        onClick={() => props.onAddToQueue(track.uri)}
                        title="Add to Spotify Queue"
                      >
                        <ListPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-60">Loading tracks...</p>
              )}
            </div>
          }
        >
          <div className="space-y-6 pt-2">
            {/* Favorite Genre */}
            {props.topGenre ? (
              <div className="border border-light/30 rounded p-4 bg-dark/30">
                <p className="text-xs uppercase tracking-wide text-light/70 mb-2">
                  Your Favorite Genre
                </p>
                <p className="text-2xl font-semibold capitalize text-light group">
                  {props.topGenre.split("").map((char, index) => (
                    <span
                      key={`${char}-${index}`}
                      className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-green"
                      style={{ transitionDelay: `${index * 30}ms` }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </p>
                <p className="text-xs text-light/60 mt-2">
                  Based on your top 50 tracks
                </p>
              </div>
            ) : (
              <div className="border border-light/30 rounded p-4 bg-dark/20">
                <p className="text-xs uppercase tracking-wide text-light/70 mb-2">
                  Your Favorite Genre
                </p>
                <p className="text-sm text-light/60">Calculating...</p>
              </div>
            )}

            {/* Top Artists */}
            <div>
              <h3 className="text-sm uppercase tracking-wide opacity-70 mb-3">
                Top Artists
              </h3>
              {props.topArtists && props.topArtists.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {props.topArtists.slice(0, 5).map((artist) => (
                    <a
                      key={artist.id}
                      href={artist.external_urls?.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 border border-light/30 rounded-full hover:bg-green/10 hover:border-green/50 hover:text-green transition-all duration-200"
                    >
                      {artist.images?.[2]?.url && (
                        <img
                          src={artist.images[2].url}
                          alt={artist.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm font-medium">{artist.name}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-60">Loading artists...</p>
              )}
            </div>
          </div>
        </CollapsibleCard>
      </section>
    </div>
  );
}
