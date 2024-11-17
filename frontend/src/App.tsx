import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/store";
import { auth, db } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { login, logout, setLoading } from "./store/slices/authSlice";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile, UserRole } from "./types/types";

// Components
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import LoadingScreen from "./components/LoadingScreen";
import Profile from "./pages/profile";
import FeedbackPanel from "./pages/feedbackPanel";
import AdminDashboard from "./pages/adminDashboard";
import Users from "./pages/userManagement";
import Papers from "./pages/paperManagement";
import Certificates from "./pages/certificates";
import Letters from "./pages/letters";
import Settings from "./pages/settings";

// Route configuration with role-based access
const routes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    roles: [UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT],
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
    roles: [UserRole.ADMIN],
  },
  {
    path: "/profile",
    element: <Profile />,
    roles: [UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT],
  },
  {
    path: "/feedback-panel",
    element: <FeedbackPanel />,
    roles: [UserRole.ADMIN, UserRole.REVIEWER],
  },
  {
    path: "/users",
    element: <Users />,
    roles: [UserRole.ADMIN],
  },
  {
    path: "/papers",
    element: <Papers />,
    roles: [UserRole.ADMIN, UserRole.REVIEWER],
  },
  {
    path: "/certificates",
    element: <Certificates />,
    roles: [UserRole.ADMIN, UserRole.STUDENT],
  },
  {
    path: "/letters",
    element: <Letters />,
    roles: [UserRole.ADMIN, UserRole.STUDENT],
  },
  {
    path: "/settings",
    element: <Settings />,
    roles: [UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT],
  },
];

const getDefaultRoute = (role?: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin-dashboard";
    case UserRole.REVIEWER:
      return "/feedback-panel";
    case UserRole.STUDENT:
      return "/dashboard";
    default:
      console.warn("No role or unknown role, defaulting to /dashboard");
      return "/dashboard";
  }
};

const ProtectedRoute = ({
  element,
  roles,
}: {
  element: JSX.Element;
  roles: UserRole[];
}) => {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!roles.includes(user.role)) {
    console.log("Role mismatch - redirecting to:", getDefaultRoute(user.role));
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return element;
};

const App = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (!userDoc.exists()) {
            dispatch(logout());
            return;
          }

          const userData = userDoc.data();

          const userProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL,
            role: userData.role || UserRole.STUDENT,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
          };

          dispatch(login(userProfile));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error syncing auth state:", error);
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={getDefaultRoute(user.role)} replace />}
      />
      <Route
        path="/auth"
        element={<Navigate to={getDefaultRoute(user.role)} replace />}
      />

      <Route element={<AuthenticatedLayout />}>
        {routes.map(({ path, element, roles }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute element={element} roles={roles} />}
          />
        ))}
      </Route>

      <Route
        path="*"
        element={<Navigate to={getDefaultRoute(user.role)} replace />}
      />
    </Routes>
  );
};

export default App;
