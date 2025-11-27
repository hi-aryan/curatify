import { createSlice } from '@reduxjs/toolkit';

/*
    User slice: manages authentication state
    - isLoggedIn: whether user is authenticated with Spotify
    - profile: user's Spotify profile data (null if not logged in)
*/
const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        profile: null,
    },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.profile = action.payload;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.profile = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

