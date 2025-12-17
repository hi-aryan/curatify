// store/sidebar-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  open: boolean;
}

const initialState: SidebarState = {
  open: true, // Default state
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.open = !state.open;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
