import { createBrowserRouter, RouterProvider } from "react-router";
import Register from "../features/auth/ui/pages/Register.jsx";
import Login from "../features/auth/ui/pages/Login.jsx";
import Profile from "../features/profile/ui/pages/Profile.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";

const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <Profile />,
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/login",
                element: <Login />,
            },
        ],
    }
])

const AppRoutes = () => {
  return <RouterProvider router={router} />;
}

export default AppRoutes