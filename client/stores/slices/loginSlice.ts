'use client'

import { createSlice } from '@reduxjs/toolkit'

interface PopupState {
    isLoginOpen: boolean
    step: number,
    phoneNumber: string,
    isSeller: boolean
}

const initialState: PopupState = {
    isLoginOpen: false,
    step: 1,
    phoneNumber: '',
    isSeller: false
}

export const loginSlice = createSlice({
    name: 'login modal',
    initialState,
    reducers: {
        handleLoginOpen: (state) => {
            state.isLoginOpen = true
        },
        handleLoginClose: state => {
            state.isLoginOpen = false
        },
        nextStep: (state) => {
            state.step += 1
        },
        previousStep: (state) => {
            if (state.step > 0) {
                state.step -= 1
            }
        },
        setPhoneNumber: (state, action) => {
            state.phoneNumber = action.payload;
        },
        handleIsSeller: (state, action) => {
            state.isSeller = action.payload
        }
    },
})

export const {
    handleLoginOpen,
    handleLoginClose,
    nextStep,
    previousStep,
    setPhoneNumber,
    handleIsSeller
} = loginSlice.actions

export default loginSlice.reducer
