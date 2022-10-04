import { createSlice } from '@reduxjs/toolkit'

import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store'

// Following this tutorial: https://redux-toolkit.js.org/tutorials/quick-start
// Typescript version: https://github.com/reduxjs/cra-template-redux-typescript/tree/master/template/src/features/counter

interface ICounterState {
  count: number
}

interface IPayload {
  amount: number
}

// declare initial state
const initialState: ICounterState = {
  count: 0,
}

// Create the reducers
const incrementReducer: CaseReducer<ICounterState, PayloadAction<IPayload>> = (
  state,
  action
) => {
  const { amount } = action.payload
  state.count += amount
}
const decrementReducer: CaseReducer<ICounterState, PayloadAction<IPayload>> = (
  state,
  action
) => {
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
export const countSelector = (state: RootState) => state.counter.count
export default counterSlice.reducer
