import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import chartsReducer from "./chartsSlice.js";

/* global state object, composed of user and charts slices */
export const store = configureStore({
  reducer: {
    user: userReducer,
    charts: chartsReducer,
  },
});
