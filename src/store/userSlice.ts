import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  isLoggedIn: boolean;
  profile: any[] | null;
  topArtist: string | null;
  topTracks: any[] | null;
  topArtists: any[] | null;
  topGenre: string | null;
}
/*
    User slice: manages authentication state
    - isLoggedIn: whether user is authenticated with Spotify
    - profile: user's Spotify profile data (null if not logged in)
*/
export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    profile: null,
    topArtist: null,
    topTracks: null,
    topArtists: null,
    topGenre: null,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.profile = action.payload.profile;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.profile = null;
      state.topArtist = null;
      state.topTracks = null;
      state.topArtists = null;
      state.topGenre = null;
    },
    setTopArtist(state, action) {
      state.topArtist = action.payload;
    },
    setTopTracks(state, action) {
      state.topTracks = action.payload;
    },
    setTopArtists(state, action) {
      state.topArtists = action.payload;
    },
    setTopGenre(state, action) {
      state.topGenre = action.payload;
    },
  },
});

export const {
  login,
  logout,
  setTopArtist,
  setTopTracks,
  setTopArtists,
  setTopGenre,
} = userSlice.actions;
export default userSlice.reducer;
