import { createSlice } from '@reduxjs/toolkit'

// Following this tutorial: https://redux-toolkit.js.org/tutorials/quick-start

const initialState = {
  count: 0,
}

// Create the reducers
const incrementReducer = (state, action) => {
  const { amount } = action.payload
  state.count += amount
}
const decrementReducer = (state, action) => {
  const { amount } = action.payload
  state.count -= amount
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: incrementReducer,
    decrement: decrementReducer,
  },
})

export const { increment, decrement } = counterSlice.actions
export const countSelector = (state) => state.counter.count
export default counterSlice.reducer
