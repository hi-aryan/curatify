"use client";

import { useEffect, useState } from "react";
import { getPublicUserProfile } from "../actions/userActions";
import UserProfileView from "../views/UserProfileView";

interface UserProfilePresenterProps {
  spotifyId: string;
}

export default function UserProfilePresenter({ spotifyId }: UserProfilePresenterProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicUserProfile(spotifyId);
        if (data) {
          // Normalize the data for the view
          const userData = {
            id: data.id,
            spotifyId: data.spotifyId,
            name: data.name,
            topArtists: data.topArtists as any[],
          };
          setUser(userData);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Failed to fetch user profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (spotifyId) {
      fetchUser();
    } else {
      setError("Invalid Spotify ID");
      setLoading(false);
    }
  }, [spotifyId]);

  return (
    <UserProfileView
      user={user}
      loading={loading}
      error={error}
    />
  );
}
