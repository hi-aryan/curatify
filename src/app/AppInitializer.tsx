"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getValidAccessToken } from "../api/spotifyAuth";
import { getUserProfile } from "../api/spotifySource";
import { login } from "../store/userSlice";
import { SuspenseView } from "../views/SuspenseView";
import { setIsMobile } from "../store/uiSlice";

const MOBILE_BREAKPOINT = 768;

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    async function restoreSessionACB() {
      try {
        const accessToken = await getValidAccessToken();
        if (accessToken) {
          const profile = await getUserProfile(accessToken);
          dispatch(login({ profile }));
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
      } finally {
        setIsRestoring(false);
      }
    }
    restoreSessionACB();

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleResize = () => {
      dispatch(setIsMobile(mql.matches));
    };

    handleResize();

    mql.addEventListener("change", handleResize);

    return () => mql.removeEventListener("change", handleResize);
  }, [dispatch]);

  if (isRestoring) {
    return <SuspenseView promise={Promise.resolve()} error={null} />;
  }

  return <>{children}</>;
}
