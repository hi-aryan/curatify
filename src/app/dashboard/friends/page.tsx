"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FriendsPage() {
  const [friendInput, setFriendInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [followError, setFollowError] = useState("");

  const handleSearchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendInput.trim()) return;

    setSearchLoading(true);
    setFollowError("");
    try {
      // TODO: Implement user search logic
      // const response = await fetch(`/api/users/search?q=${friendInput}`);
      // const data = await response.json();
      // setSearchResults(data);
    } catch (error) {
      setFollowError("Failed to search users");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFollowUser = async (userId: string) => {
    try {
      // TODO: Implement follow user logic
      // const response = await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
      // if (response.ok) {
      //   // Add to followed users
      // }
    } catch (error) {
      setFollowError("Failed to follow user");
    }
  };

  const handleUnfollowUser = async (userId: string) => {
    try {
      // TODO: Implement unfollow user logic
      // const response = await fetch(`/api/users/${userId}/unfollow`, { method: 'POST' });
      // if (response.ok) {
      //   // Remove from followed users
      // }
    } catch (error) {
      setFollowError("Failed to unfollow user");
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Friends</h1>
        <p className="text-light/60 mb-8">
          Connect with friends and explore their music tastes.
        </p>

        <Card className="border-light/40 bg-dark/40">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Find Friends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Form */}
            <form onSubmit={handleSearchUsers} className="flex gap-2">
              <input
                type="text"
                value={friendInput}
                onChange={(e) => setFriendInput(e.target.value)}
                placeholder="Search username..."
                className="flex-1 bg-light/5 border border-light/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-green/50 transition-colors"
              />
              <Button
                type="submit"
                disabled={!friendInput.trim() || searchLoading}
                className="bg-green hover:bg-green/90 text-dark font-medium"
              >
                {searchLoading ? "..." : "Search"}
              </Button>
            </form>

            {followError && <p className="text-pink text-xs">{followError}</p>}

            {/* Search Results */}
            {searchResults && searchResults.length > 0 && (
              <div className="border-b border-light/10 pb-4">
                <h3 className="text-sm uppercase tracking-wide opacity-50 mb-2">
                  Search Results
                </h3>
                <div className="space-y-2">
                  {/* Results will be mapped here */}
                </div>
              </div>
            )}

            {/* Following List */}
            <div>
              <h3 className="text-sm uppercase tracking-wide opacity-50 mb-3">
                Following ({followedUsers?.length || 0})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {followedUsers && followedUsers.length > 0 ? (
                  followedUsers.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2 rounded bg-light/5"
                    >
                      <span className="text-sm">{friend.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnfollowUser(friend.id)}
                        className="text-xs text-pink hover:text-pink/80"
                      >
                        Unfollow
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm opacity-60">
                    No friends yet. Search to add some!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
