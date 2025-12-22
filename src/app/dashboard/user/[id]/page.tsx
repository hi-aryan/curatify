"use client";

import { UserProfilePresenter } from "@/presenters/UserProfilePresenter";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const id = Number(params.id);

  if (isNaN(id)) {
    return (
      <div className="p-8 text-center text-pink">
        Invalid user reference.
      </div>
    );
  }

  return <UserProfilePresenter userId={id} />;
}
