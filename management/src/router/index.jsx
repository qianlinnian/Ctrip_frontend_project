import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '../pages//login/login.jsx';
import Register from "../pages/login/register.jsx";
import Dashboard from "../pages/hotel/merchant-dashboard.jsx";
import MerchantHotelForm from "../pages/hotel/merchant-hotel-form.jsx";
import AuditPage from "../pages/audit/audit.jsx";
import RoomManage from "../pages/hotel/room-manage.jsx";
import HotelManage from "../pages/hotel/hotel-manage.jsx";



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
        path: '/audit',
        element: <AuditPage />,
    },
    //酒店管理
    {
        path: '/merchant-dashboard/hotel-manage',
        element: <HotelManage />,
    },
        
]);

function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;

