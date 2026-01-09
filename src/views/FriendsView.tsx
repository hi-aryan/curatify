import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Check, X } from "lucide-react";
import Link from "next/link";
import { FriendsCombobox } from "@/components/FriendsCombobox";

interface User {
  id: string | number;
  spotifyId: string;
  name: string;
  topArtists?: any[];
}

interface FriendsViewProps {
  friendInput: string;
  onFriendInputChange: (val: string) => void;
  searchResults: User[];
  followedUsers: User[];
  searchLoading: boolean;
  followedLoading: boolean;
  followError: string;
  successMessage: string;
  confirmingUnfollow: string | number | null;
  onSelectUser: (user: User) => void;
  onRequestUnfollow: (userId: string | number) => void;
  onConfirmUnfollow: (userId: string | number) => void;
  onCancelUnfollow: () => void;
}

export default function FriendsView({
  friendInput,
  onFriendInputChange,
  searchResults,
  followedUsers,
  searchLoading,
  followedLoading,
  followError,
  successMessage,
  confirmingUnfollow,
  onSelectUser,
  onRequestUnfollow,
  onConfirmUnfollow,
  onCancelUnfollow,
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
            {/* Friends Combobox */}
            <FriendsCombobox
              searchValue={friendInput}
              onSearchChange={onFriendInputChange}
              searchResults={searchResults}
              isLoading={searchLoading}
              onSelectUser={onSelectUser}
            />

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green/10 border border-green/20 text-green text-sm">
                <Check size={16} />
                <span>Added <strong>{successMessage}</strong> to your friends!</span>
              </div>
            )}

            {/* Error Message */}
            {followError && (
              <p className="text-pink text-xs">{followError}</p>
            )}

            {/* Following List */}
            <div>
              <h3 className="text-sm uppercase tracking-wide opacity-50 mb-3">
                Following ({followedUsers?.length || 0})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {followedLoading ? (
                  <p className="text-sm opacity-40 animate-pulse italic">
                    Loading your friends...
                  </p>
                ) : followedUsers && followedUsers.length > 0 ? (
                  followedUsers.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-light/5 gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-xs flex-shrink-0">
                          {friend.name?.charAt(0) || "?"}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <Link
                            href={`/dashboard/user/${friend.spotifyId}`}
                            className="font-bold hover:text-green transition-colors"
                          >
                            {friend.name}
                          </Link>
                          {friend.topArtists && friend.topArtists.length > 0 && (
                            <span className="text-[10px] opacity-60 truncate">
                              Current Top Artist: {friend.topArtists[0].name}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Unfollow button or confirmation */}
                      {confirmingUnfollow === friend.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-light/60 mr-2">Unfollow?</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onConfirmUnfollow(friend.id)}
                            className="h-7 w-7 p-0 text-pink hover:bg-pink/20"
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCancelUnfollow}
                            className="h-7 w-7 p-0 text-light/60 hover:bg-light/10"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRequestUnfollow(friend.id)}
                          className="text-xs text-light/50 hover:text-pink hover:bg-pink/10 transition-colors"
                        >
                          Unfollow
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm opacity-60">
                    No friends yet. Search for their Spotify username to add them!
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

