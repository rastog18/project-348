import { configureStore } from '@reduxjs/toolkit'
import counterReducer from 'store/slices/counterSlice'
import authReducer from 'store/slices/authSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    authState: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type DispatchType = typeof store.dispatch

export default store
