import { createSlice } from "@reduxjs/toolkit";

// Helper function to determine role (role is passed in payload)
const getRoleFromPayload = (userData) => {
  // Role should be determined before calling setAuthUser
  return userData.role || "user";
};

const initialState = {
  user: null, // { id, email, role }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser(state, action) {
      const userData = action.payload;
      if (userData) {
        state.user = {
          id: userData.id,
          email: userData.email,
          role: userData.role || getRoleFromPayload(userData),
        };
      } else {
        state.user = null;
      }
    },
    clearAuthUser(state) {
      state.user = null;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;

// Selectors
export const selectAuthUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role || "visitor";
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";
export const selectIsUser = (state) => state.auth.user?.role === "user";

export default authSlice.reducer;

