import { configureStore } from '@reduxjs/toolkit'

import { inject } from 'api/auth/config'
import authReducer, { setToken } from 'store/slices/authSlice'
import counterReducer from 'store/slices/counterSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    authState: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type DispatchType = typeof store.dispatch

inject(store, setToken)

export default store
