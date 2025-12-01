/*
    LandingView: the public landing page for non-signed-in users
    
    Displays:
    - Hero section with login
    - Nordic map with chart data
    - Custom playlist creator (drag songs)
    
    Props:
    - selectedCountry: currently hovered country code
    - onCountryHover: callback when user hovers a country
    - onLoginClick: callback when user clicks sign in
*/
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LandingView(props) {
    function loginClickHandlerACB() {
        props.onLoginClick();
    }

    return (
        <div className="min-h-screen">
            {/* Hero section */}
            <header className="p-8">
                <h1 className="text-4xl font-bold">Curatify</h1>
                <p className="mt-2 text-lg opacity-70">Discover Nordic music charts</p>
                <Button 
                    onClick={loginClickHandlerACB}
                    variant="outline"
                    className="mt-4 rounded-full border-green/50 text-green hover:bg-green/10 hover:rotate-1 hover:scale-105 transition-all duration-200"
                >
                    Sign in with Spotify
                </Button>
            </header>

            {/* Features grid */}
            <section className="p-8 grid gap-6 md:grid-cols-2">
                {/* Nordic Charts Card */}
                <Card className="border-light/40 bg-dark/40">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Nordic Charts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-light/30 rounded p-8 text-center bg-dark/30">
                            {/* TODO: Add interactive map component */}
                            <p className="text-light opacity-60 mb-2">Nordic Map Placeholder</p>
                            <p className="text-sm text-light/60">
                                Selected: {props.selectedCountry || "None"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Playlist Creator Card */}
                <Card className="border-light/40 bg-dark/40">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Create Playlist</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-light/30 rounded p-8 text-center bg-dark/30">
                            {/* TODO: Add drag-and-drop playlist creator */}
                            <p className="text-light opacity-60">Playlist Creator Placeholder</p>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}

