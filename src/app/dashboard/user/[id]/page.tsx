"use client";

import UserProfilePresenter from "@/presenters/UserProfilePresenter";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const id = params.id as string;

  if (!id) {
    return (
      <div className="p-8 text-center text-pink">
        Invalid user reference.
      </div>
    );
  }

  return <UserProfilePresenter spotifyId={id} />;
}
