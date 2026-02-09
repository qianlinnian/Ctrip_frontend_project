import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '../pages//login/login.jsx';
import Register from "../pages/login/register.jsx";
import Dashboard from "../pages/hotel/merchant-dashboard.jsx";
import MerchantHotelForm from "../pages/hotel/merchant-hotel-form.jsx";


const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/merchant-dashboard',
        element: <Dashboard />,
    },
    {
        path: '/merchant-hotel-form',
        element: <MerchantHotelForm />,
    },
]);

function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;

