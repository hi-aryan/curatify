"use client";

import { useState, useEffect } from "react";
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

  // Load followed users on mount
  useEffect(() => {
    async function loadFollowed() {
      if (profile?.id) {
        setFollowedLoading(true);
        try {
          const followed = await getFollowedUsers(profile.id);
          setFollowedUsers(followed || []);
        } catch (error) {
          console.error("Failed to load followed users:", error);
        } finally {
          setFollowedLoading(false);
        }
      } else {
        setFollowedLoading(false);
      }
    }
    loadFollowed();
  }, [profile?.id]);

  const handleSearchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendInput.trim() || !profile?.id) return;

    setSearchLoading(true);
    setFollowError("");
    try {
      const results = await searchUsers(profile.id, friendInput.trim());
      setSearchResults(results || []);
      if (results && results.length === 0) {
        setFollowError("No users found.");
      }
    } catch (error) {
      setFollowError("Failed to search users");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFollowUser = async (targetName: string) => {
    if (!profile?.id) return;
    try {
      const result = await followUser(profile.id, targetName);
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
      onSearchUsers={handleSearchUsers}
      onFollowUser={handleFollowUser}
      onUnfollowUser={handleUnfollowUser}
    />
  );
}
