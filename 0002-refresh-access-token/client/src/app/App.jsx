import AuthProvider from "../features/auth/state/AuthContext";
import AppRoutes from "../routes/AppRoutes";

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
