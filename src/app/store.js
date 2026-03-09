import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import annoncesReducer from "../features/annonces/annoncesSlice";
import usersReducer from "../features/users/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    annonces: annoncesReducer,
    users: usersReducer,
  },
});

