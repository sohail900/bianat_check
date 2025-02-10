import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

/**
 * @description: configure store
 * @param {object} initialState - initial state
 * @returns {object} store - store
 */

import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import stockReducer from '../features/Stock/stockSlice'
import languageReducer from '../features/Language/languageSlice'
import filterSettings from '../features/FilterSettings/filterSettings'
import themeReducer from '../features/Theme/themeSlice'
import authReducer from '../features/Auth/authSlice'
import screenerReducer from '../features/Screener/screenerSlice'
import industryReducer from '../features/Industry/industrySlice'
import rankIndustryStockReducer from '../features/RankIndustryStock/rankIndustryStockSlice'
import stepReducer from '../features/Steps/stepSlice'
import realTime from '../features/RealTime/realTime'

// configure auth persist
const authPersistConfig = {
    key: 'auth',
    storage,
}
// configure theme persist
const themePersistConfig = {
    key: 'currentTheme',
    storage,
}
const languagePersistConfig = {
    key: 'currentLanguage',
    storage,
}
// configure stock persist
const stockPersistConfig = {
    key: 'currentStock',
    storage,
}

const stockTypePersistConfig = {
    key: 'stockType',
    storage,
}
const industryPersistConfig = {
    key: 'currentIndustry',
    storage,
}

const screenerPersistConfig = {
    key: 'currentScreener',
    storage,
}

// combine all reducers
const rootReducer = combineReducers({
    currentStock: persistReducer(stockPersistConfig, stockReducer),
    stockType: persistReducer(stockTypePersistConfig, stockReducer),
    currentIndustry: persistReducer(industryPersistConfig, industryReducer),
    currentScreener: persistReducer(screenerPersistConfig, screenerReducer),
    filterSettings,
    currentTheme: persistReducer(themePersistConfig, themeReducer),
    currentLanguage: persistReducer(languagePersistConfig, languageReducer),
    auth: persistReducer(authPersistConfig, authReducer),
    realTime: realTime,
    currentStep: stepReducer,
    rankIndustryStock: rankIndustryStockReducer,
})
const restReducer = (state, action) => {
    if (action.type === 'logout') {
        state = undefined
    }
    return rootReducer(state, action)
}
// configure store
const store = configureStore({
    reducer: restReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
                ignoredPaths: ['filter'],
            },
        }),
})

const persistor = persistStore(store)
export { store, persistor }
