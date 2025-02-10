import { createSlice } from "@reduxjs/toolkit";

/**
 * @name rankIndustrySlice
 * @type {object}
 * @property {number} currentStock - current stock
 * @property {function} updateIndustry - update stock
 * @description: Stock slice
 */

const initialState = {
  RankIndustryStock: false,
};

export const rankIndustryStockSlice = createSlice({
  name: "rankIndustry",
  initialState,
  reducers: {
    updateRankIndustryStock: (state, action) => {
      state.RankIndustryStock = action.payload;
    },
  },
});

export const { updateRankIndustryStock } = rankIndustryStockSlice.actions;

export default rankIndustryStockSlice.reducer;
