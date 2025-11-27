import { useSelector } from 'react-redux'; /* instead of mobx observer */
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { LandingPresenter } from './presenters/LandingPresenter.jsx';
import { DashboardPresenter } from './presenters/DashboardPresenter.jsx';

/*
    App: root component with routing
    
    Routes:
    - / : Landing page (public)
    - /dashboard : User dashboard (requires auth)
    
    Pattern from TW: hash-based routing with createHashRouter
*/
export function App() {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const routes = [
        { path: "/", element: <LandingPresenter /> },
        { 
            path: "/dashboard", 
            element: isLoggedIn ? <DashboardPresenter /> : <LandingPresenter /> 
        },
    ];

    const router = createHashRouter(routes);

    return <RouterProvider router={router} />;
}

