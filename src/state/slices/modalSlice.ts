import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMenuOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openSideMenu(state) {
      state.isMenuOpen = true;
    },
    closeSideMenu(state) {
      state.isMenuOpen = false;
    },
  },
});

export const { openSideMenu, closeSideMenu } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
