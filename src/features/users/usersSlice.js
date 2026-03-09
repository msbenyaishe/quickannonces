import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.items = action.payload;
    },
    addUser(state, action) {
      const userExists = state.items.find((u) => u.id === action.payload.id);
      if (!userExists) {
        state.items.push(action.payload);
      } else {
        // Update existing user
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      }
    },
    deleteUser(state, action) {
      state.items = state.items.filter((u) => u.id !== action.payload);
    },
  },
});

export const { setUsers, addUser, deleteUser } = usersSlice.actions;

// Selectors
export const selectAllUsers = (state) => state.users.items;
export const selectUsersStats = (state) => ({
  total: state.users.items.length,
});

export default usersSlice.reducer;

