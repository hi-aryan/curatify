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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ReduxSidebarProvider } from "@/components/redux-sidebar-provider";
import { Music } from "lucide-react";

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
    <ReduxSidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen">
          {/* Header with user profile and favorite artist */}
          <header className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-8 justify-between items-start mb-6">
                {/* Left: Profile info */}
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

                {/* Right: Action buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => props.onFriendsOpen(true)}
                    variant="outline"
                    className="hover:bg-green/10 hover:text-green hover:border-green/50 transition-all duration-200"
                  >
                    Friends
                  </Button>
                </div>
              </div>

              {/* Favorite artist and genre row */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Favorite Artist */}
                <div className="flex items-center gap-4 p-4 rounded-lg border border-light/20 bg-light/5">
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
                          className="w-16 h-16 rounded-full object-cover border border-light/40"
                        />
                      </a>
                    ) : (
                      <img
                        src={props.favoriteArtist.image}
                        alt={props.favoriteArtist.name}
                        className="w-16 h-16 rounded-full object-cover border border-light/40"
                      />
                    ))}
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-70 mb-1">
                      Favourite artist
                    </p>
                    <p className="text-xl font-bold text-green">
                      {props.favoriteArtist?.name || "Not available"}
                    </p>
                  </div>
                </div>

                {/* Favorite Genre */}
                <div className="flex items-center justify-center p-4 rounded-lg border border-light/20 bg-light/5">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide opacity-70 mb-2">
                      Favourite genre
                    </p>
                    <p className="text-2xl font-bold text-blue">
                      {props.topGenre || "Not available"}
                    </p>
                  </div>
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
                <form
                  onSubmit={props.onSearchUsers}
                  className="flex gap-2 mb-4"
                >
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
                            <span className="text-sm font-medium">
                              {user.name}
                            </span>
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

          {/* Main content - Top tracks preview */}
          <main className="p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Your Top Tracks</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {props.topTracks && props.topTracks.length > 0 ? (
                  props.topTracks.map((track, index) => (
                    <Card
                      key={index}
                      className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-all hover:-translate-y-1"
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          {track.album?.images?.[0]?.url && (
                            <img
                              src={track.album.images[0].url}
                              alt={track.name}
                              className="w-24 h-24 rounded-lg mb-4 object-cover"
                            />
                          )}
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Music className="w-4 h-4 text-green" />
                            <span className="text-xs text-green font-semibold">
                              #{index + 1} Top Track
                            </span>
                          </div>
                          <h3 className="font-semibold text-light mb-1 line-clamp-2">
                            {track.name}
                          </h3>
                          <p className="text-sm opacity-70 line-clamp-1">
                            {track.artists?.map((a) => a.name).join(", ")}
                          </p>
                          {track.external_urls?.spotify && (
                            <a
                              href={track.external_urls.spotify}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 text-xs text-green hover:text-green/80 transition-colors"
                            >
                              Listen on Spotify →
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-light/60 col-span-3 text-center py-8">
                    Loading your top tracks...
                  </p>
                )}
              </div>

              {/* Quick links to tools */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Tools & Features</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-all hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Playlist Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm opacity-70 mb-4">
                        Analyze your playlists and discover mood profiles.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-green/10 hover:border-green/50 hover:text-green"
                        onClick={() =>
                          (window.location.href = "/dashboard/playlist-stats")
                        }
                      >
                        Explore
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-all hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm opacity-70 mb-4">
                        Get AI-powered song suggestions for you.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-green/10 hover:border-green/50 hover:text-green"
                        onClick={() =>
                          (window.location.href = "/dashboard/recommender")
                        }
                      >
                        Discover
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-all hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">My Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm opacity-70 mb-4">
                        Deep dive into your listening statistics.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-green/10 hover:border-green/50 hover:text-green"
                        onClick={() =>
                          (window.location.href = "/dashboard/my-stats")
                        }
                      >
                        View Stats
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-all hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Playlist Sorter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm opacity-70 mb-4">
                        Organize and sort your playlists.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-green/10 hover:border-green/50 hover:text-green"
                        onClick={() =>
                          (window.location.href = "/dashboard/sorter")
                        }
                      >
                        Sort
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-all hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm opacity-70 mb-4">
                        Manage your account and preferences.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-green/10 hover:border-green/50 hover:text-green"
                        onClick={() =>
                          (window.location.href = "/dashboard/settings")
                        }
                      >
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </ReduxSidebarProvider>
  );
}
