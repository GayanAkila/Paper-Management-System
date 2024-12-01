import axios from "axios";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
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
import axiosInstance from "./services/axiosInstance";

// Route configuration with role-based access
const routes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    roles: [UserRole.STUDENT],
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
    roles: [UserRole.REVIEWER],
  },
  {
    path: "/users",
    element: <Users />,
    roles: [UserRole.ADMIN],
  },
  {
    path: "/papers",
    element: <Papers />,
    roles: [UserRole.ADMIN],
  },
  {
    path: "/certificates",
    element: <Certificates />,
    roles: [UserRole.ADMIN],
  },
  {
    path: "/letters",
    element: <Letters />,
    roles: [UserRole.ADMIN],
  },
  {
    path: "/settings",
    element: <Settings />,
    roles: [UserRole.ADMIN],
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

  if (!user || !isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  if (!roles.includes(user.role)) {
    console.log("Role mismatch - redirecting to:", getDefaultRoute(user.role));
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return element;
};

const isAuthenticated = () => {
  const token = localStorage.getItem("idToken");
  return !!token;
};

const App = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  // Inside App.tsx useEffect
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axiosInstance.get("/users/me");
        const userProfile: UserProfile = {
          uid: response.data.uid,
          email: response.data.email,
          displayName: response.data.name,
          role: response.data.role,
          idToken: localStorage.getItem("idToken") || "",
          refreshToken: localStorage.getItem("refreshToken") || "",
        };
        dispatch(login(userProfile));
      } catch (error) {
        // Only logout if it's an auth error
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          dispatch(logout());
        }
        console.error("Error fetching user profile:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    const token = localStorage.getItem("idToken");
    if (token) {
      fetchUserProfile();
    } else {
      dispatch(setLoading(false));
    }
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
