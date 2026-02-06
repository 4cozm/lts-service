import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import StaffLogin from "./pages/StaffLogin";
import Register from "./pages/Register";
import Board from "./pages/Board";

function RequireStaff({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<StaffLogin />} />
        <Route
          path="/register"
          element={
            <RequireStaff>
              <Register />
            </RequireStaff>
          }
        />
        <Route path="/board" element={<Board />} />
      </Routes>
    </AuthProvider>
  );
}
