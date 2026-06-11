import { configureStore } from "@reduxjs/toolkit";
import authReducer   from "./authSlice";
import dsaReducer    from "./dsaSlice";
import notesReducer  from "./notesSlice";
import streakReducer from "./streakSlice";

export const store = configureStore({
  reducer: {
    auth:   authReducer,
    dsa:    dsaReducer,
    notes:  notesReducer,
    streak: streakReducer,
  },
});
