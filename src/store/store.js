import { configureStore } from "@reduxjs/toolkit";
import annoncesReducer from "../redux/annoncesSlice";
import usersReducer from "../redux/usersSlice";
import authReducer from "../redux/authSlice";

export const store = configureStore({
  reducer: {
    annonces: annoncesReducer,
    users: usersReducer,
    auth: authReducer,
  },
});