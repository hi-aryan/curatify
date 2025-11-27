import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import chartsReducer from './chartsSlice.js';

export const store = configureStore({
    reducer: {
        user: userReducer,
        charts: chartsReducer,
    },
});

