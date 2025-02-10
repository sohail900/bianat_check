import { createSlice } from "@reduxjs/toolkit";

/**
 * @name themeSlice
 * @type {object}
 * @property {string} currentTheme - current theme
 * @property {function} updateTheme - update theme
 * @description: Theme slice
 */

const initialState = {
  currentTheme: "Dark",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    updateTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { updateTheme } = themeSlice.actions;

export default themeSlice.reducer;
