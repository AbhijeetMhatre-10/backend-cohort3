import { useForm } from "react-hook-form";
import { useAuthContext } from "../state/AuthContext";
import useAxiosAPI from "../../../config/axiosInstance";
import { useNavigate } from "react-router";

const useLogin = () => {
  const { setUser, setAccessToken } = useAuthContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const api = useAxiosAPI();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);

      const user = response.data.data.user;
      const accessToken = response.data.accessToken;

      setUser(user);
      setAccessToken(accessToken);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);

      /*
       * Backend validation errors
       */
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;

        Object.entries(backendErrors).forEach(([field, message]) => {
          setError(field, {
            type: "server",
            message: typeof message === "string" ? message : message.message,
          });
        });

        return;
      }

      /*
       * General login error
       */
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError("root", {
        type: "server",
        message,
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
};

export default useLogin;
