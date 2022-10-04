import { createAsyncThunk } from '@reduxjs/toolkit'
import to from 'await-to-js'

import {
  getUser as _getUser,
  login as _login,
  logout as _logout,
  register as _register,
} from 'api/auth'

import type { AuthResponse } from 'api/auth'
import type { AxiosError } from 'axios'

// https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk

type Error = {
  error: {
    name: string
    message: string
  }
}

export const getUser = createAsyncThunk<
  { user: IUserAuth },
  void,
  {
    rejectValue: {
      name: string
      message: string
    }
  }
>('user/me', async (_, { rejectWithValue }) => {
  const [error, res] = await to(_getUser())

  if (error) {
    const { response } = error as AxiosError
    return rejectWithValue((response?.data as Error).error)
  }

  return res.data
})

export const register = createAsyncThunk<
  AuthResponse,
  IUserAuth,
  {
    rejectValue: {
      name: string
      message: string
    }
  }
>('user/register', async ({ email, password }, { rejectWithValue }) => {
  const [error, res] = await to(_register({ email, password }))

  if (error) {
    console.log(error)
    const { response } = error as AxiosError
    return rejectWithValue((response?.data as Error).error)
  }

  return res.data
})

export const login = createAsyncThunk<
  AuthResponse,
  IUserAuth,
  {
    rejectValue: {
      name: string
      message: string
    }
  }
>('user/login', async ({ email, password }, { rejectWithValue }) => {
  const [error, res] = await to(_login({ email, password }))

  if (error) {
    const { response } = error as AxiosError
    return rejectWithValue((response?.data as Error).error)
  }

  return res.data
})

export const logout = createAsyncThunk<
  void,
  void,
  {
    rejectValue: {
      name: string
      message: string
    }
  }
>('user/logout', async (_, { rejectWithValue }) => {
  const [error] = await to(_logout())

  if (error) {
    const { response } = error as AxiosError
    return rejectWithValue((response?.data as Error).error)
  }
})
