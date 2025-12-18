import { useEffect, useRef } from "react";
import { useAnimate } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Music } from "lucide-react";

interface Track {
  name: string;
  artists: Array<{ name: string }>;
  album?: {
    images?: Array<{ url: string }>;
  };
  external_urls?: {
    spotify: string;
  };
}

interface InfiniteTrackScrollProps {
  tracks: Track[];
}

export function InfiniteTrackScroll({ tracks }: InfiniteTrackScrollProps) {
  const [scope, animate] = useAnimate();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!tracks || tracks.length === 0) return;

    // Card width (300px) + gap (24px from gap-6) = 324px per item
    const itemWidth = 324;
    const scrollDistance = -(itemWidth * tracks.length);

    controlsRef.current = animate(
      scope.current,
      { x: scrollDistance },
      {
        repeat: Infinity,
        repeatType: "loop",
        duration: tracks.length * 2, // 3 seconds per track for smooth speed
        ease: "linear",
      }
    );

    return () => controlsRef.current?.stop();
  }, [tracks, animate, scope]);

  function handleMouseEnter() {
    if (controlsRef.current) {
      controlsRef.current.pause();
    }
  }

  function handleMouseLeave() {
    if (controlsRef.current) {
      controlsRef.current.play();
    }
  }

  if (!tracks || tracks.length === 0) {
    return (
      <p className="text-light/60 text-center py-8">
        Loading your top tracks...
      </p>
    );
  }

  return (
    <div className="relative w-full overflow-x-hidden py-4">
      <div
        ref={scope}
        className="flex gap-6 w-max"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {[...tracks, ...tracks, ...tracks].map((track, index) => (
          <Card
            key={index}
            className="min-w-[300px] border-light/30 bg-dark/40 transition-all hover:scale-105"
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {track.album?.images?.[0]?.url && (
                  <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    className="w-24 h-24 rounded-lg mb-4 object-cover"
                  />
                )}
                <h3 className="font-semibold text-light line-clamp-2">
                  {track.name}
                </h3>
                <p className="text-sm opacity-70 line-clamp-1">
                  {track.artists?.map((a) => a.name).join(", ")}
                </p>
                {track.external_urls?.spotify && (
                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-xs text-green hover:text-green/80 transition-colors"
                  >
                    Listen on Spotify →
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
