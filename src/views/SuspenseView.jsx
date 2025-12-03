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
    <div class="visualizer-container">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  );
}
