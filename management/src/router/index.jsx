import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '../pages//login/login.jsx';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
]);

function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;

