import { createAction, createSlice } from '@reduxjs/toolkit'

import { getUser, login, logout, register } from 'store/thunks/authThunk'

import type { RootState } from 'store'

interface IUser {
  email: string
}

export enum UserState {
  IDLE,
  LOGGING_IN,
  LOGGING_OUT,
  REGISTERING,
}

export interface IAuthState {
  user: IUser | null
  loading: boolean
  error: {
    name: string
    message: string
  } | null
  success: boolean
  state: UserState
  token: string | null
}

// declare initial state
const initialState: IAuthState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  state: UserState.IDLE,
  token: null,
}

export const setToken = createAction<{ token: string }>('user/setToken')

// Create the reducers
export const authStateSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // set token
    builder.addCase(setToken, (state, action) => {
      state.token = action.payload.token
    })

    // registration
    builder.addCase(register.pending, (state) => {
      state.state = UserState.REGISTERING
      state.loading = true
      state.error = null
    })
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.state = UserState.IDLE
    })
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload!
      state.state = UserState.IDLE
      state.token = null
    })

    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
      state.state = UserState.LOGGING_IN
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.state = UserState.IDLE
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload!
      state.token = null
      state.state = UserState.IDLE
    })

    // logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true
      state.error = null
      state.state = UserState.LOGGING_OUT
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false
      state.success = true
      state.user = null
      state.state = UserState.IDLE
      state.token = null
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload!
      state.state = UserState.IDLE
    })

    // get user
    builder.addCase(getUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.user = action.payload.user
      state.state = UserState.IDLE
    })
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload!
      state.state = UserState.IDLE
    })
  },
})

export const authStateSelector = (state: RootState) => state.authState
export default authStateSlice.reducer
