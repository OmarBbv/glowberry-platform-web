import { configureStore } from '@reduxjs/toolkit'
import popupReducer from './slices/globalToggleSlice';
import loginReducer from './slices/loginSlice';
import sellerReducer from './slices/sellerSlice';

export const store = configureStore({
    reducer: {
        popup: popupReducer,
        login: loginReducer,
        seller: sellerReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

