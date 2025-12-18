import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

/*
    RecommenderView: displays AI music recommendations
    
    Props:
    - recommendations: array of recommended songs with title, artist, reason, type
    - recLoading: whether recommendation fetch is in progress
    - recError: error message if recommendation failed
    - onGetRecommendations: callback to trigger recommendation fetch
    - onAddToQueue: callback to add track to Spotify queue
*/
interface Recommendation {
  title: string;
  artist: string;
  reason: string;
  type: string;
}

interface RecommenderViewProps {
  recommendations: Recommendation[] | null;
  recLoading: boolean;
  recError: string | null;
  onGetRecommendations: () => void;
  onAddToQueue: (uri: string) => void;
  profile: any;
}

export default function RecommenderView({
  recommendations,
  recLoading,
  recError,
  onGetRecommendations,
  onAddToQueue,
  profile,
}: RecommenderViewProps) {
  return (
    <div className="h-full md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Song Recommendations</h1>
        <p className="text-light/60 mb-8">
          Get song suggestions based on your recent listening history.
        </p>

        <Card className="border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent hover:border-green/50 hover:shadow-2xl hover:shadow-green/[0.1] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-300 transform rotate-12 pointer-events-none">
            <Sparkles size={200} />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center justify-between opacity-80">
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            {!recommendations ? (
              <div className="text-center py-4">
                <Button
                  onClick={onGetRecommendations}
                  disabled={recLoading}
                  className="w-full bg-white/10 text-white/90 hover:bg-green/80 hover:text-dark border-0 backdrop-blur-sm transition-all duration-300 font-semibold py-6"
                >
                  {recLoading ? (
                    <span className="flex items-center gap-2 text-green animate-pulse">
                      <Sparkles className="w-4 h-4" />
                      Analyzing...
                    </span>
                  ) : (
                    "Get Suggestions"
                  )}
                </Button>
                {recError && (
                  <p className="text-red-400 text-xs mt-3">{recError}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-3 bg-light/5 rounded border border-light/10 hover:border-green/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-light">{rec.title}</h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          rec.type === "Safe Bet"
                            ? "border-blue-400/50 text-blue-300"
                            : rec.type === "Wild Card"
                            ? "border-purple-400/50 text-purple-300"
                            : "border-green/50 text-green"
                        }`}
                      >
                        {rec.type}
                      </span>
                    </div>
                    <p className="text-sm text-light/70 mb-2">{rec.artist}</p>
                    <p className="text-xs text-light/50 italic">
                      "{rec.reason}"
                    </p>
                  </div>
                ))}
                <Button
                  onClick={onGetRecommendations}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-light/40 hover:text-green hover:bg-green/10 mt-4 transition-colors"
                >
                  Refresh suggestions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
