import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chartsReducer from "./chartsSlice";

/* global state object, composed of user and charts slices */
export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      charts: chartsReducer,
    },
  });
};
