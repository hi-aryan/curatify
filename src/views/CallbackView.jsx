/*
    CallbackView: displays authentication callback results

    Shows error state when OAuth callback fails, or loading state during processing.

    Props:
    - error: Error object if authentication failed
    - onBackToHome: callback when user clicks "Back to Home"
*/
export function CallbackView(props) {
    function backToHomeHandlerACB() {
        props.onBackToHome();
    }

    if (props.error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-pink mb-4">Authentication failed</p>
                    <p className="text-sm text-light">{props.error.message}</p>
                    <button
                        onClick={backToHomeHandlerACB}
                        className="mt-4 px-4 py-2 bg-green text-dark rounded"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Loading state - could use SuspenseView, but keeping simple for now
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-light">Processing authentication...</p>
            </div>
        </div>
    );
}
