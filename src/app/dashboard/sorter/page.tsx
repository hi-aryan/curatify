import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SorterPage() {
  return (
    <div>
        <h1 className="text-4xl font-bold mb-6">Sorter</h1>
        <p className="text-light/60 mb-8">
          The heavy lifting tool for organizing your playlists.
        </p>

        <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Sort Playlists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-light opacity-60">Coming soon...</p>
          </CardContent>
        </Card>
    </div>
  );
}
