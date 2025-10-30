import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.userReducer.currentUser);
  const role = useSelector(
    (state: RootState) => state.userReducer.currentUser?.role
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.userReducer.currentUser != null
  );

  const hasRole = (requiredRole: string | string[]) => {
    if (!role) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    return role === requiredRole;
  };

  return {
    user,
    role,
    isAuthenticated,
    hasRole,
  };
};
