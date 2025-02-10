import { createSlice } from "@reduxjs/toolkit";

/**
 * @name StepSlice
 * @type {object}
 * @property {function} updateStep - update stock
 * @description: Stock slice
 */

const initialState = {
  currentStep: 0,
};

export const StepSlice = createSlice({
  name: "currentStep",
  initialState,
  reducers: {
    updateStep: (state, action) => {
      state.currentStep = action.payload;
    },
  },
});

export const { updateStep } = StepSlice.actions;

export default StepSlice.reducer;
