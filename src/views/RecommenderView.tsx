import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/*
    RecommenderView: displays AI music recommendations
    
    Props:
    - recommendations: array of recommended songs with title, artist, reason, type
    - recLoading: whether recommendation fetch is in progress
    - recError: error message if recommendation failed
    - onGetRecommendations: callback to trigger recommendation fetch
    - onAddToQueue: callback to add track to Spotify queue
*/
export default function RecommenderView({
  recommendations,
  recLoading,
  recError,
  onGetRecommendations,
  onAddToQueue,
}) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Song Recommendations</h1>
        <p className="text-light/60 mb-8">
          Get AI-powered song suggestions based on your music taste.
        </p>

        <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center justify-between">
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!recommendations ? (
              <div className="text-center py-4">
                <p className="text-light opacity-60 mb-4">
                  Get custom song suggestions based on your statistics.
                </p>
                <Button
                  onClick={onGetRecommendations}
                  disabled={recLoading}
                  variant="outline"
                  className="w-full border-light/40 text-light/90 hover:bg-green/5 hover:border-green/60 hover:text-green/90 transition-all"
                >
                  {recLoading ? (
                    <span className="text-xs text-green animate-pulse">
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
                  className="w-full text-xs text-light/40 hover:text-green mt-2"
                >
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
