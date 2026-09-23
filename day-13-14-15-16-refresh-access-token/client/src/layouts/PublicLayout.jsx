import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import useAxiosAPI from "../config/axiosInstance";
import { useAuthContext } from "../features/auth/state/AuthContext";

const PublicLayout = () => {
  const { accessToken, setAccessToken, setUser } = useAuthContext();
  const [isCheckingAuth, setIsCheckingAuth] = useState(!accessToken);
  const api = useAxiosAPI();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      return;
    }


    const refreshAccessToken = async () => {
      try {
        const response = await api.post("/auth/refresh");
        setAccessToken(response.data.accessToken);
        setUser(response.data.data.user);
      } catch {
        navigate("/login", { replace: true });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    refreshAccessToken();
  }, [accessToken, api, navigate, setAccessToken, setUser]);

  if (isCheckingAuth) {
    return <div>Checking authentication...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PublicLayout;