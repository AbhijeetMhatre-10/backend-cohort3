import axios from "axios";
import { useEffect } from "react";
import { useAuthContext } from "../features/auth/state/AuthContext";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

const useAxiosAPI = () => {
  const { accessToken } = useAuthContext();

  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    return () => axiosInstance.interceptors.request.eject(interceptorId);
  }, [accessToken]);

  return axiosInstance;
};

export default useAxiosAPI;
