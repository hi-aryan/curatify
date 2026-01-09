"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import FriendsView from "../views/FriendsView";
import {
  followUser,
  getFollowedUsers,
  searchUsers,
  unfollowUser,
} from "../actions/friendActions";

export function FriendsPresenter() {
  const profile = useSelector((state: RootState) => state.user.profile);

  const [friendInput, setFriendInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [followedLoading, setFollowedLoading] = useState(true);
  const [followError, setFollowError] = useState("");

  // Debounce timer ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load followed users on mount
  useEffect(() => {
    async function loadFollowed() {
      if (!profile?.id) {
        setFollowedLoading(false);
        return;
      }

      setFollowedLoading(true);
      try {
        const followed = await getFollowedUsers(profile.id);
        setFollowedUsers(followed || []);
      } catch (error) {
        console.error("Failed to load followed users:", error);
      } finally {
        setFollowedLoading(false);
      }
    }
    loadFollowed();
  }, [profile?.id]);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't search if input is empty or no user
    if (!friendInput.trim() || !profile?.id) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    // Debounce: wait 300ms before searching
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchUsers(profile.id, friendInput.trim());
        setSearchResults(results || []);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [friendInput, profile?.id]);

  // Called when user selects from combobox
  const handleSelectUser = async (user: { spotifyId: string }) => {
    if (!profile?.id) return;

    setFollowError("");
    try {
      const result = await followUser(profile.id, user.spotifyId);
      if (result.success) {
        // Reload list
        const followed = await getFollowedUsers(profile.id);
        setFollowedUsers(followed || []);
        setSearchResults([]); // Reset search on success
        setFriendInput("");
      } else {
        setFollowError(result.error || "Failed to follow user");
      }
    } catch (error) {
      setFollowError("An unexpected error occurred");
    }
  };

  const handleUnfollowUser = async (targetUserId: number) => {
    if (!profile?.id) return;
    if (!confirm("Are you sure you want to unfollow?")) return;

    try {
      const result = await unfollowUser(profile.id, targetUserId);
      if (result.success) {
        setFollowedUsers((prev) => prev.filter((u) => u.id !== targetUserId));
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
  };

  return (
    <FriendsView
      friendInput={friendInput}
      onFriendInputChange={setFriendInput}
      searchResults={searchResults}
      followedUsers={followedUsers}
      searchLoading={searchLoading}
      followedLoading={followedLoading}
      followError={followError}
      onSelectUser={handleSelectUser}
      onUnfollowUser={handleUnfollowUser}
    />
  );
}
