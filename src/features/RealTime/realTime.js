import { createSlice } from "@reduxjs/toolkit";

/**
 * @name stockSlice
 * @type {object}
 * @property {number} currentStock - current stock
 * @property {function} updateStock - update stock
 * @description: Stock slice
 */

const initialState = {
  realTimeData: {},
};

export const stockSlice = createSlice({
  name: "realTime",
  initialState,
  reducers: {
    updateRealTime: (state, action) => {
      state.realTimeData = action.payload;
    },
  },
});

export const { updateRealTime } = stockSlice.actions;

export default stockSlice.reducer;
