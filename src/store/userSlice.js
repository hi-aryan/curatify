import { createSlice } from '@reduxjs/toolkit';

/*
    User slice: manages authentication state
    - isLoggedIn: whether user is authenticated with Spotify
    - profile: user's Spotify profile data (null if not logged in)
    - accessToken: Spotify access token for API calls
*/
const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        profile: null,
        accessToken: null,
        topArtist: null,
    },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.profile = action.payload.profile;
            state.accessToken = action.payload.accessToken;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.profile = null;
            state.accessToken = null;
        },
        setTopArtist(state, action) {
            state.topArtist = action.payload;
        },
    },
});

export const { login, logout, setTopArtist } = userSlice.actions;
export default userSlice.reducer;

