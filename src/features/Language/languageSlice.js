import { createSlice } from "@reduxjs/toolkit";
/**
 * @name languageSlice
 * @type {object}
 * @property {string} currentLanguage - current language
 * @property {function} changeLanguage - change language
 * @description: Language slice
 */

const initialState = {
  currentLanguage: "ar",
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      localStorage.setItem("currentLanguage", action.payload);
    },
  },
});

export const { changeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
