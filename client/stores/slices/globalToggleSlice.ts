'use client'

import { createSlice } from '@reduxjs/toolkit'

interface PopupState {
    isOpen: boolean,
    isCreateProd: boolean
    isShowShareModal: boolean
}

const initialState: PopupState = {
    isOpen: false,
    isCreateProd: false,
    isShowShareModal: false
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
        // handleCreateProdOpen: (state) => {
        //     state.isCreateProd = true
        // },
        // handleCreateProdClose: (state) => {
        //     state.isCreateProd = false
        // },
        handleToggleProductShareModal: (state) => {
            state.isShowShareModal = !state.isShowShareModal;
        }
    },
})

export const { open, close, toggle, handleToggleProductShareModal } = popupSlice.actions
export default popupSlice.reducer
