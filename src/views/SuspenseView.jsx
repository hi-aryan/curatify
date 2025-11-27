/*
    SuspenseView: displays loading state or error
    Pattern from TW1-3: check promise state to decide what to show
*/
export function SuspenseView(props) {
    // no promise = no data requested
    if (!props.promise) {
        return <span className="text-gray-500">No data</span>;
    }

    // promise exists but error occurred
    if (props.error) {
        return <span className="text-red-500">{props.error.toString()}</span>;
    }

    // promise exists, no error = loading
    return (
        <div className="flex items-center justify-center p-4">
            <span className="text-gray-400">Loading...</span>
        </div>
    );
}

