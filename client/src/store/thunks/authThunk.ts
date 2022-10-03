import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AuthResponse } from 'api/auth'
import {
  register as _register,
  login as _login,
  getUser as _getUser,
  logout as _logout,
} from 'api/auth'
import to from 'await-to-js'
import type { AxiosError } from 'axios'

// https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk

type Error = {
  error: {
    name: string
    message: string
  }
}

const setTokenToLocalStorage = (token: string) =>
  localStorage.setItem('mern-boilerplate-session-token', token)

const getTokenFromLocalStorage = () =>
  localStorage.getItem('mern-boilerplate-session-token')

const removeTokenFromLocalStorage = () =>
  localStorage.removeItem('mern-boilerplate-session-token')

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
    const { response } = error as AxiosError
    return rejectWithValue((response?.data as Error).error)
  }

  const { token } = res.data
  setTokenToLocalStorage(token)

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

  const { token } = res.data
  setTokenToLocalStorage(token)

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

  removeTokenFromLocalStorage()
})
