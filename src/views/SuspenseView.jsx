/*
    SuspenseView: displays loading state or error
    Pattern from TW1-3: check promise state to decide what to show

    Props:
    - promise: Promise object to track loading state
    - error: Error object to display
    - onRetry: Optional callback for retry action (shows retry button on error)
    - loadingMessage: Optional custom loading message (default: "Loading...")
    - noDataMessage: Optional custom no-data message (default: "No data")
*/
export function SuspenseView(props) {
  // no promise = no data requested
  if (!props.promise) {
    return <span className="text-light">{props.noDataMessage || "No data"}</span>;
  }

  // promise exists but error occurred
  if (props.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-pink mb-4">{props.error.toString()}</p>
          {props.onRetry && (
            <button
              onClick={props.onRetry}
              className="px-4 py-2 bg-green text-dark rounded"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // promise exists, no error = loading
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      {/* Audio visualizer bars */}
      <div className="flex items-end gap-1 h-16">
        <div className="w-2 h-full rounded-full bg-green origin-bottom animate-equalizer-1" />
        <div className="w-2 h-full rounded-full bg-green origin-bottom animate-equalizer-2" />
        <div className="w-2 h-full rounded-full bg-green origin-bottom animate-equalizer-3" />
        <div className="w-2 h-full rounded-full bg-green origin-bottom animate-equalizer-4" />
        <div className="w-2 h-full rounded-full bg-green origin-bottom animate-equalizer-5" />
      </div>
      <span className="text-light/70 text-sm tracking-widest uppercase">
        {props.loadingMessage || "Loading..."}
      </span>
    </div>
  );
}
