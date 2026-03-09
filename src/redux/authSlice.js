import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { currentUserId: null },
  reducers: {
    login(state, action) {
      state.currentUserId = action.payload;
    },
    logout(state) {
      state.currentUserId = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;