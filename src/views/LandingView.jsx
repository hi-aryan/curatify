/*
    LandingView: the public landing page for non-signed-in users
    
    Displays:
    - Nordic map with chart data
    - Custom playlist creator (drag songs)
    
    Props:
    - selectedCountry: currently hovered country code
    - onCountryHover: callback when user hovers a country
    - onLoginClick: callback when user clicks sign in
*/
export function LandingView(props) {
    function countryHoverHandlerACB(countryCode) {
        props.onCountryHover(countryCode);
    }

    function loginClickHandlerACB() {
        props.onLoginClick();
    }

    return (
        <div className="min-h-screen">
            {/* Hero section */}
            <header className="p-8">
                <h1 className="text-4xl font-bold">Curatify</h1>
                <p className="mt-2 text-lg">Discover Nordic music charts</p>
                <button 
                    onClick={loginClickHandlerACB}
                    className="mt-4 px-6 py-2 bg-green text-dark rounded-full"
                >
                    Sign in with Spotify
                </button>
            </header>

            {/* Map section - placeholder */}
            <section className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Nordic Charts</h2>
                <div className="border-2 border-dashed border-light p-8 text-center">
                    {/* TODO: Add interactive map component */}
                    <p>Nordic Map Placeholder</p>
                    <p className="text-sm text-light">
                        Selected: {props.selectedCountry || "None"}
                    </p>
                </div>
            </section>

            {/* Playlist creator section - placeholder */}
            <section className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Create Playlist</h2>
                <div className="border-2 border-dashed border-light p-8 text-center">
                    {/* TODO: Add drag-and-drop playlist creator */}
                    <p>Playlist Creator Placeholder</p>
                </div>
            </section>
        </div>
    );
}

