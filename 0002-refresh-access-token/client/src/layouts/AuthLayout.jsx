import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../features/auth/state/AuthContext";

const AuthLayout = () => {
  const { accessToken } = useAuthContext();

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;