'use client';
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "../store/userSlice.js";
import { getAccessToken } from "../api/spotifyAuth.js";
import { getUserProfile } from "../api/spotifySource.js";
import { SuspenseView } from "../views/SuspenseView.jsx";
// resolvePromise removed as we handle state locally for React compatibility

/*
    CallbackPresenter: handles Spotify OAuth callback

    Pattern:
    - Extract authorization code from URL and handle OAuth flow
    - Dispatch login action and redirect to dashboard on success
    - Use SuspenseView for loading/error states
*/
export function CallbackPresenter() {
  const dispatch = useDispatch();
  const router = useRouter();
  // instead of resolvePromise.js
  const [promiseState, setPromiseState] = useState({ promise: null, data: null, error: null }); 
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    function handleCallbackACB() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        setPromiseState({
          promise: null,
          data: null,
          error: new Error("No authorization code found")
        });
        return;
      }

      // Create promise for OAuth flow
      const oauthPromise = (async () => {
        // getAccessToken exchanges code and stores all token data internally
        const accessToken = await getAccessToken(code);
        const profile = await getUserProfile(accessToken);

        dispatch(login({ profile }));
        // Redirect to dashboard on success
        router.push("/dashboard");
        return profile;
      })();

      // Update state to loading
      setPromiseState({ promise: oauthPromise, data: null, error: null });

      // Handle promise resolution
      oauthPromise
        .then((data) => {
          setPromiseState(prev => prev.promise === oauthPromise ? { ...prev, data } : prev);
        })
        .catch((error) => {
          // Only report error if it's not a "verification missing" race condition that might happen despite checks
          setPromiseState(prev => prev.promise === oauthPromise ? { ...prev, error } : prev);
        });
    }

    handleCallbackACB();
  }, [dispatch, router]);

  function backToHomeACB() {
    router.push("/");
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
