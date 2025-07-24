'use client'

import { createSlice } from '@reduxjs/toolkit'

interface SellerState {
    isOpen: boolean
}

const initialState: SellerState = {
    isOpen: false,
}

export const sellerSlice = createSlice({
    name: 'seller',
    initialState,
    reducers: {
        handleToggle: (state) => {
            state.isOpen = !state.isOpen;
        }
    },
})

export const {
    handleToggle
} = sellerSlice.actions

export default sellerSlice.reducer
