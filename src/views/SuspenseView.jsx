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
    <div className="flex justify-center items-center h-screen gap-1.5">
      <div className="w-2.5 h-12 bg-green rounded-full animate-equalizer-1"></div>
      <div className="w-2.5 h-12 bg-green rounded-full animate-equalizer-2"></div>
      <div className="w-2.5 h-12 bg-green rounded-full animate-equalizer-3"></div>
      <div className="w-2.5 h-12 bg-green rounded-full animate-equalizer-4"></div>
      <div className="w-2.5 h-12 bg-green rounded-full animate-equalizer-5"></div>
    </div>
  );
}
