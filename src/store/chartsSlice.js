import { createSlice } from '@reduxjs/toolkit';

/*
    Charts slice: manages Nordic charts data
    - selectedCountry: currently hovered/selected country code
    - chartsPromiseState: promise state for fetching chart data {promise, data, error}
*/
const chartsSlice = createSlice({
    name: 'charts',
    initialState: {
        selectedCountry: null,
        chartsPromiseState: {},
    },
    reducers: {
        setSelectedCountry(state, action) {
            state.selectedCountry = action.payload;
        },
        setChartsPromiseState(state, action) {
            state.chartsPromiseState = action.payload;
        },
    },
});

export const { setSelectedCountry, setChartsPromiseState } = chartsSlice.actions;
export default chartsSlice.reducer;

