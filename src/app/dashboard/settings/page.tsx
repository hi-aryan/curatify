import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Settings</h1>
        <p className="text-light/60 mb-8">
          Manage your account and preferences.
        </p>

        <div className="space-y-6">
          <Card className="border-light/40 bg-dark/40">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-light opacity-60">
                Privacy settings coming soon...
              </p>
            </CardContent>
          </Card>

          <Card className="border-light/40 bg-dark/40">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-light opacity-60">
                Notification preferences coming soon...
              </p>
            </CardContent>
          </Card>

          <Card className="border-light/40 bg-dark/40">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Display</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-light opacity-60">
                Display settings coming soon...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
