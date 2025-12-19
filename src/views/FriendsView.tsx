import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface User {
  id: string | number;
  name: string;
}

interface FriendsViewProps {
  friendInput: string;
  onFriendInputChange: (val: string) => void;
  searchResults: User[];
  followedUsers: User[];
  searchLoading: boolean;
  followError: string;
  onSearchUsers: (e: React.FormEvent) => void;
  onFollowUser: (userId: string) => void;
  onUnfollowUser: (userId: string | number) => void;
}

export default function FriendsView({
  friendInput,
  onFriendInputChange,
  searchResults,
  followedUsers,
  searchLoading,
  followError,
  onSearchUsers,
  onFollowUser,
  onUnfollowUser,
}: FriendsViewProps) {
  return (
    <div className="h-full md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Friends</h1>
        <p className="text-light/60 mb-8">
          Connect with friends and explore their music tastes.
        </p>

        <Card className="border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent hover:border-green/50 hover:shadow-2xl hover:shadow-green/[0.1] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-300 transform rotate-12 pointer-events-none">
            <Users size={200} />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl font-semibold">
              Find Friends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            {/* Search Form */}
            <form onSubmit={onSearchUsers} className="flex gap-2">
              <input
                type="text"
                value={friendInput}
                onChange={(e) => onFriendInputChange(e.target.value)}
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
                  {searchResults.map((user) => (
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
                        onClick={() => onFollowUser(user.id.toString())}
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
                Following ({followedUsers?.length || 0})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {followedUsers && followedUsers.length > 0 ? (
                  followedUsers.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2 rounded bg-light/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-xs">
                          {friend.name?.charAt(0) || "?"}
                        </div>
                        <span className="text-sm font-medium">{friend.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUnfollowUser(friend.id)}
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
