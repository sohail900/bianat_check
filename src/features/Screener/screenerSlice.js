import { createSlice } from "@reduxjs/toolkit";

/**
 * @name screenerSlice
 * @type {object}
 * @property {number} currentStock - current stock
 * @property {function} updateScreener - update screener
 * @description: Stock slice
 */

const initialState = {
  currentScreener: "",
  screenerName:"",
};

export const screenerSlice = createSlice({
  name: "screener",
  initialState,
  reducers: {
    updateScreener: (state, action) => {
      state.currentScreener = action.payload;
    },
    updateScreenerName:(state,action)=>{
        state.screenerName= action.payload;
    }
  },

});

export const { updateScreener,updateScreenerName } = screenerSlice.actions;

export default screenerSlice.reducer;
