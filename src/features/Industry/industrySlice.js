import { createSlice } from "@reduxjs/toolkit";

/**
 * @name industrySlice
 * @type {object}
 * @property {number} currentStock - current stock
 * @property {function} updateIndustry - update stock
 * @description: Stock slice
 */

const initialState = {
  currentIndustry: "Banks",
  bianatGroupSymbol:''
};

export const industrySlice = createSlice({
  name: "industry",
  initialState,
  reducers: {
    updateIndustry: (state, action) => {
      state.currentIndustry = action.payload;
    },
    updateBianatGroupSymbol: (state, action) => {
      state.bianatGroupSymbol = action.payload;
    },
  },
});

export const { updateIndustry,updateBianatGroupSymbol } = industrySlice.actions;

export default industrySlice.reducer;
