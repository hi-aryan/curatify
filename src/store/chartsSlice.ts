import { createSlice } from "@reduxjs/toolkit";

export interface ChartsState {
  selectedCountry: string | null;
  chartsPromiseState: {
    promise: Promise<any> | null;
    data: any | null;
    error: any | null;
  };
  dummyPlaylist: any[] | null;
}
/*
    Charts slice: manages Nordic charts data
    - selectedCountry: currently hovered/selected country code
    - chartsPromiseState: promise state for fetching chart data {promise, data, error}
    - dummyPlaylist: array of tracks added to the landing page playlist builder
*/
const chartsSlice = createSlice({
  name: "charts",
  initialState: {
    selectedCountry: null,
    chartsPromiseState: {},
    dummyPlaylist: [],
  },
  reducers: {
    setSelectedCountry(state, action) {
      state.selectedCountry = action.payload;
    },
    setChartsPromiseState(state, action) {
      state.chartsPromiseState = action.payload;
    },
    addToPlaylist(state, action) {
      const track = action.payload;
      // Prevent duplicates
      if (!state.dummyPlaylist.some((t) => t.id === track.id)) {
        state.dummyPlaylist.push(track);
      }
    },
    removeFromPlaylist(state, action) {
      const trackId = action.payload;
      state.dummyPlaylist = state.dummyPlaylist.filter((t) => t.id !== trackId);
    },
    reorderPlaylist(state, action) {
      state.dummyPlaylist = action.payload;
    },
    clearPlaylist(state) {
      state.dummyPlaylist = [];
    },
    setDummyPlaylist(state, action) {
      state.dummyPlaylist = action.payload;
    },
  },
});

export const {
  setSelectedCountry,
  setChartsPromiseState,
  addToPlaylist,
  removeFromPlaylist,
  reorderPlaylist,
  clearPlaylist,
  setDummyPlaylist,
} = chartsSlice.actions;
export default chartsSlice.reducer;
