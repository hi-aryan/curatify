import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chartsReducer from "./chartsSlice";
import uiReducer from "./uiSlice";

/* global state object, composed of user and charts slices (manages UI state, temporary session in the browser) */
export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      charts: chartsReducer,
      ui: uiReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
