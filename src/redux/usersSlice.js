import { createSlice, nanoid } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: { items: [] },
  reducers: {
    registerUser: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(user) {
        return {
          payload: { id: nanoid(), role: "user", ...user },
        };
      },
    },

    deleteUser(state, action) {
      state.items = state.items.filter(u => u.id !== action.payload);
    },
  },
});

export const { registerUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;