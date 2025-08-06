import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import AuthContext from "./AuthContext";
import { auth } from "../firebaseConfig";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔐 AuthProvider: Setting up auth listener");
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        console.log("🔐 AuthProvider: Auth state changed", {
          hasUser: !!currentUser,
          email: currentUser?.email,
          uid: currentUser?.uid,
          isAnonymous: currentUser?.isAnonymous,
          fullUser: currentUser,
        });
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("🔐 AuthProvider: Auth state change error:", error);
        setUser(null);
        setLoading(false);
      }
    );

    return () => {
      console.log("🔐 AuthProvider: Cleaning up auth listener");
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      console.log("🔐 AuthProvider: Signed out successfully");
    } catch (error) {
      console.error("🔐 AuthProvider: Sign out error:", error);
      throw error;
    }
  };

  console.log("🔐 AuthProvider rendering:", {
    hasUser: !!user,
    userEmail: user?.email,
    loading,
  });

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};