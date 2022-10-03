import { createSlice } from '@reduxjs/toolkit'
import { getUser, login, logout, register } from 'store/thunks/authThunk'
import type { RootState } from 'store'

interface IUser {
  email: string
}

export enum UserState {
  NONE,
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
}

// declare initial state
const initialState: IAuthState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  state: UserState.NONE,
}

// Create the reducers

export const authStateSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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
      state.state = UserState.NONE
    })
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload!
      state.state = UserState.NONE
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
      state.state = UserState.NONE
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload!
      state.state = UserState.NONE
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
      state.state = UserState.NONE
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload!
      state.state = UserState.NONE
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
      state.state = UserState.NONE
    })
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload!
      state.state = UserState.NONE
    })
  },
})

export const authStateSelector = (state: RootState) => state.authState
export default authStateSlice.reducer
