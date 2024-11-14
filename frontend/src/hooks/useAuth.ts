// src/hooks/useAuth.ts
import { useAppSelector } from "../store/store";
import {
  selectUser,
  selectUserRole,
  selectIsAdmin,
  selectIsReviewer,
} from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

interface UseAuthReturn {
  user: ReturnType<typeof selectUser>;
  userRole: ReturnType<typeof selectUserRole>;
  isAdmin: boolean;
  isReviewer: boolean;
  hasPermission: (requiredRoles: string[]) => boolean;
  requireAuth: (callback: () => void) => void;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const userRole = useAppSelector(selectUserRole);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isReviewer = useAppSelector(selectIsReviewer);

  const hasPermission = (requiredRoles: string[]): boolean => {
    if (!user || !userRole) return false;
    return requiredRoles.includes(userRole);
  };

  const requireAuth = (callback: () => void) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    callback();
  };

  return {
    user,
    userRole,
    isAdmin,
    isReviewer,
    hasPermission,
    requireAuth,
  };
};
