import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import UserProvider from "./context/UserProvider";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/useAuth";
import InstallApp from "./components/InstallApp";

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function RootGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading…</div>;
  }

  return user ? <Navigate to="/dashboard" replace /> : <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading…</div>}>
          <Routes>
            <Route path="/" element={<RootGate />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <InstallApp />
      </UserProvider>
    </AuthProvider>
  );
}
