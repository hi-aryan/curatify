"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCircle, Mic } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfileViewProps {
  user: {
    id: number;
    name: string | null;
    topArtists: any[] | null;
  } | null;
  loading: boolean;
  error: string | null;
}

export default function UserProfileView({ user, loading, error }: UserProfileViewProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-green/20 border-t-green animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20">
        <p className="text-pink mb-4">{error || "User not found"}</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const topArtist = user.topArtists?.[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Page-wide Theme Icon */}
      <div className="absolute right-[-90px] top-[-20px] opacity-[0.01] transform rotate-12 pointer-events-none select-none z-0">
        <Mic size={600} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="hover:bg-light/10"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold">User Profile</h1>
      </header>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-stretch">
        {/* Left Col: Profile Basic Info */}
        <div className="flex flex-col">
          <Card className="border-light/10 bg-gradient-to-br from-white/[0.05] to-transparent h-full">
            <CardContent className="pt-8 flex flex-col items-center justify-center text-center h-full">
              <div className="w-24 h-24 rounded-full bg-green/20 flex items-center justify-center text-green mb-4 shrink-0">
                <UserCircle size={48} />
              </div>
              <h2 className="text-2xl font-bold">{user.name || "Anonymous"}</h2>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Detailed Stats */}
        <div className="flex flex-col gap-6">
          <Card className="border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                 <Mic size={18} className="text-green" />
                 Top Artist
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topArtist ? (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-light/[0.03] border border-light/5">
                  {topArtist.image ? (
                    <img
                      src={topArtist.image}
                      alt={topArtist.name}
                      className="w-20 h-20 rounded-full object-cover border border-light/20"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-light/10 flex items-center justify-center">
                      <Mic size={24} className="opacity-30" />
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-50">Current Favorite</p>
                    <h3 className="text-xl font-bold">{topArtist.name}</h3>
                  </div>
                </div>
              ) : (
                <p className="text-sm opacity-50 italic">No top artist data shared yet.</p>
              )}
            </CardContent>
          </Card>

          {/* More sections (top songs, playlists) can go here in the future */}
          <div className="p-8 border border-dashed border-light/10 rounded-xl flex flex-col items-center justify-center text-center opacity-40 flex-1">
             <p className="text-sm">More insights coming soon...</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
