import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { LandingPresenter } from "./presenters/LandingPresenter.jsx";
import { DashboardPresenter } from "./presenters/DashboardPresenter.jsx";
import { CallbackPresenter } from "./presenters/CallbackPresenter.jsx";
import { login } from "./store/userSlice.js";
import { getValidAccessToken } from "./api/spotifyAuth.js";
import { getUserProfile } from "./api/spotifySource.js";
import { SuspenseView } from "./views/SuspenseView.jsx";

/*
    App: root component with routing
    
    Routes:
    - / : Landing page (public)
    - /dashboard : User dashboard (requires auth)
    
    Pattern from TW: hash-based routing with createHashRouter
    
    Note: Spotify redirects to /callback?code=xxx (not hash-based).
    We detect this and render CallbackPresenter outside the hash router.
    
    Session restoration: On mount, check localStorage for stored token
    and restore the session if valid.
*/
export function App() {
  // DEBUG: View SuspenseView in isolation
  // return <SuspenseView promise={{}} error={null} />;

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [isRestoring, setIsRestoring] = useState(true);

  // Restore session from stored token on mount (refreshes if expired)
  useEffect(() => {
    async function restoreSessionACB() {
      try {
        // getValidAccessToken returns stored token or refreshes if expired
        const accessToken = await getValidAccessToken();
        if (accessToken) {
          const profile = await getUserProfile(accessToken);
          dispatch(login({ profile }));
        }
      } catch {
        // Token invalid or refresh failed - user will need to re-login
      }
      setIsRestoring(false);
    }
    restoreSessionACB();
  }, [dispatch]);

  // Handle OAuth callback (Spotify redirects to /callback?code=xxx)
  const params = new URLSearchParams(window.location.search);
  if (params.get("code")) {
    return <CallbackPresenter />;
  }

  // Show loading while restoring session
  if (isRestoring) {
    return <SuspenseView promise={{}} error={null} />;
  }

  const routes = [
    { path: "/", element: <LandingPresenter /> },
    {
      path: "/dashboard",
      element: isLoggedIn ? <DashboardPresenter /> : <LandingPresenter />,
    },
  ];

  const router = createHashRouter(routes);

  return <RouterProvider router={router} />;
}
