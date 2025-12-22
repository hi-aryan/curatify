"use client";

import { useEffect, useState } from "react";
import { getUserById } from "../actions/userActions";
import UserProfileView from "../views/UserProfileView";

interface UserProfilePresenterProps {
  userId: number;
}

export function UserProfilePresenter({ userId }: UserProfilePresenterProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (!userId) {
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const userData = await getUserById(userId);
        if (userData) {
          setUser(userData);
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  return (
    <UserProfileView
      user={user}
      loading={loading}
      error={error}
    />
  );
}
