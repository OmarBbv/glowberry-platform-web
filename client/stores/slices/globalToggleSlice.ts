'use client'

import { createSlice } from '@reduxjs/toolkit'

interface PopupState {
    isOpen: boolean,
    isCreateProd: boolean
}

const initialState: PopupState = {
    isOpen: false,
    isCreateProd: false
}

export const popupSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        open: (state) => {
            state.isOpen = true
        },
        close: (state) => {
            state.isOpen = false
        },
        toggle: (state) => {
            state.isOpen = !state.isOpen
        },
        handleCreateProdOpen: (state) => {
            state.isCreateProd = true
        },
        handleCreateProdClose: (state) => {
            state.isCreateProd = false
        }
    },
})

export const { open, close, toggle, } = popupSlice.actions
export default popupSlice.reducer
