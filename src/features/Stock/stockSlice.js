import {createSlice} from "@reduxjs/toolkit";

/**
 * @name stockSlice
 * @type {object}
 * @property {number} currentStock - current stock
 * @property {function} updateStock - update stock
 * @description: Stock slice
 */

const initialState = {
    currentStock: 1050,
    stockType: 'Stock'
};

export const stockSlice = createSlice({
    name: "stock",
    initialState,
    reducers: {
        updateStock: (state, action) => {
            state.currentStock = action.payload;
        },
        updateStockType: (state, action) => {
            state.stockType = action.payload;
        }
    }
});

export const {updateStock, updateStockType} = stockSlice.actions;

export default stockSlice.reducer;
