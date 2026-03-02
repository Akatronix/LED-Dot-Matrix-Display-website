import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/myComponent/Dashboard";
import DotMatrixController from "./components/myComponent/DotMatrixController";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/signupPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./protectedRoutes/protectedRoute";
import PublicRoute from "./publicRoutes/publicRoute";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <DotMatrixController />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
