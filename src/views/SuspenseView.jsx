/*
    SuspenseView: displays loading state or error
    Pattern from TW1-3: check promise state to decide what to show
*/
export function SuspenseView(props) {
  // no promise = no data requested
  if (!props.promise) {
    return <span className="text-light">No data</span>;
  }

  // promise exists but error occurred
  if (props.error) {
    return <span className="text-pink">{props.error.toString()}</span>;
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
        Loading...
      </span>
    </div>
  );
}
