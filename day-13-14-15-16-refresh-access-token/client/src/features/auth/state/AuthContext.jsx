import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(
    () => localStorage.getItem("accessToken"),
  );

  const setAccessToken = (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }

    setAccessTokenState(token);
  };

  return (
    <AuthContext
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext>
  );
};

// This module intentionally owns both the provider and its related hook.
// eslint-disable-next-line react-refresh/only-export-components
export { useAuthContext };
export default AuthProvider;
