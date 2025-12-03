import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice.js";
import { getAccessToken } from "../api/spotifyAuth.js";
import { getUserProfile } from "../api/spotifySource.js";
import { SuspenseView } from "../views/SuspenseView.jsx";
import { resolvePromise } from "../resolvePromise.js";

/*
    CallbackPresenter: handles Spotify OAuth callback

    Pattern:
    - Extract authorization code from URL and handle OAuth flow
    - Dispatch login action and redirect to dashboard on success
    - Use SuspenseView for loading/error states

    Note: Rendered outside RouterProvider, so we use window.location for navigation
*/
export function CallbackPresenter() {
  const dispatch = useDispatch();
  const [promiseState, setPromiseState] = useState({});

  useEffect(() => {
    function handleCallbackACB() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        // No code found - immediately resolve with error
        resolvePromise(
          Promise.reject(new Error("No authorization code found")),
          promiseState
        );
        return;
      }

      // Create promise for OAuth flow
      const oauthPromise = (async () => {
        // getAccessToken exchanges code and stores all token data internally
        const accessToken = await getAccessToken(code);
        const profile = await getUserProfile(accessToken);

        dispatch(login({ profile }));
        // Redirect to dashboard on success
        window.location.href = window.location.origin + "/#/dashboard";
      })();

      resolvePromise(oauthPromise, promiseState);
    }

    handleCallbackACB();
  }, [dispatch]);

  function backToHomeACB() {
    window.location.href = window.location.origin;
  }

  return (
    <SuspenseView
      promise={promiseState.promise}
      error={promiseState.error}
      onRetry={backToHomeACB}
      loadingMessage="Processing authentication..."
    />
  );
}
