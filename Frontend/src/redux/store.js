// // ** Redux Imports
import reducer from "./rootReducer";
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
  })
export const store = configureStore({reducer,middleware:customizedMiddleware})