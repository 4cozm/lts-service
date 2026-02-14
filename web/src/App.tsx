import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import StaffLogin from "./pages/StaffLogin";
import Register from "./pages/Register";
import Display from "./pages/Display";

const Board = lazy(() => import("./pages/Board"));

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
        <Route
          path="/match"
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">보드 로딩 중...</div>}>
              <Board />
            </Suspense>
          }
        />
        <Route path="/display" element={<Display />} />
      </Routes>
    </AuthProvider>
  );
}
