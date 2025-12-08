/*
    SuspenseView: displays loading state or error
    Pattern from TW1-3: check promise state to decide what to show
*/
import type { ReactElement } from "react";

interface SuspenseViewProps {
  promise: Promise<unknown> | null;
  error: Error | null;
}

export function SuspenseView({
  props,
}: {
  props: SuspenseViewProps;
}): ReactElement {
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
    <div className="visualizer-container">
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
}
