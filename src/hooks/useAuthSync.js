/**
 * Auth Sync Hook
 * Checks authentication status on app load and syncs with Redux
 */

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../features/auth/authSlice";
import { addUser } from "../features/users/usersSlice";
import { checkAuth } from "../services/api/authService";

export function useAuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing session on app load
    const syncAuth = async () => {
      try {
        const userData = await checkAuth();
        if (userData) {
          dispatch(addUser({
            id: userData.id,
            email: userData.email,
            role: userData.role,
          }));
          dispatch(setAuthUser({
            id: userData.id,
            email: userData.email,
            role: userData.role,
          }));
        } else {
          // No session, clear auth
          dispatch(setAuthUser(null));
        }
      } catch (error) {
        console.warn("Auth check failed:", error);
        dispatch(setAuthUser(null));
      }
    };

    syncAuth();
  }, [dispatch]);
}
