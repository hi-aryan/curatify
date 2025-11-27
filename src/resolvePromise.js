/*
    Helper to manage promise states (for API calls)
    Pattern from TW1-3: stores {promise, data, error} to track async state
    
    With Redux, you'd dispatch actions to update this state in a slice.
    This utility can still be used to handle the promise logic.
*/
export function resolvePromise(prms, promiseState) {
    if (!prms) {
        promiseState.promise = null;
        promiseState.data = null;
        promiseState.error = null;
        return;
    }

    promiseState.promise = prms;
    promiseState.data = null;
    promiseState.error = null;

    function successACB(result) {
        // guard against race conditions
        if (promiseState.promise === prms) {
            promiseState.data = result;
        }
    }

    function failureACB(error) {
        if (promiseState.promise === prms) {
            promiseState.error = error;
        }
    }

    prms.then(successACB).catch(failureACB);
}

