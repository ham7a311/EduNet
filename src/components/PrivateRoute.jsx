import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";  // Use your AuthProvider

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();  // Use AuthProvider instead of direct hook
  
  // Add debugging
  console.log("User from AuthProvider:", user, "Loading:", loading);
  
  // Handle loading state
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  
  // Handle unauthenticated user
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Render protected content
  return children;
}