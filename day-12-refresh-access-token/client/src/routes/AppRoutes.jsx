import { createBrowserRouter, RouterProvider } from "react-router";
import Register from "../features/auth/ui/pages/Register.jsx";
import Login from "../features/auth/ui/pages/Login.jsx";
import Profile from "../features/profile/ui/pages/Profile.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Profile />,
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/login",
        element: <Login/>
    }
])

const AppRoutes = () => {
  return <RouterProvider router={router} />;
}

export default AppRoutes