// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./store/store";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { login, logout } from "./store/slices/authSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import LoadingScreen from "./components/LoadingScreen";
import { useState } from "react";
import Profile from "./pages/profile";
import FeedbackPanel from "./pages/feedbackPanel";
import AdminDashboard from "./pages/adminDashboard";
import Users from "./pages/userManagement";
import Papers from "./pages/paperManagement";
import Certificates from "./pages/certificates";
import Letters from "./pages/letters";
import Settings from "./pages/settings";

const App = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();

          dispatch(
            login({
              email: user.email!,
              id: user.uid,
              photoUrl: user.photoURL || null,
              role: userData?.role || "user",
              displayName: user.displayName || undefined,
            })
          );
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error syncing auth state:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />

      {/* Protected routes */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback-panel" element={<FeedbackPanel />} />
        <Route path="/users" element={<Users />} />
        <Route path="/papers" element={<Papers />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/letters" element={<Letters />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
