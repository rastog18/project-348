import { configureStore } from '@reduxjs/toolkit'
import counterReducer from 'store/slices/counterSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
