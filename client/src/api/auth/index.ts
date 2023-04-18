import to from 'await-to-js'
import axios from 'axios'

import type { ActionCreatorWithPayload, Store } from '@reduxjs/toolkit'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RootState } from 'store'

// https://www.npmjs.com/package/axios-cache-adapter
// best to cache GET requests for better performance

export type Token = string

export type AuthResponse = { user: IUserAuth; token: Token }

let store: Store<RootState> | undefined
let setToken: ActionCreatorWithPayload<{ token: string }> | undefined

export const injectStore = (_store: Store) => {
  store = _store
}
export const injectSetToken = (
  _setToken: ActionCreatorWithPayload<{ token: string }>
) => {
  setToken = _setToken
}

const AuthInstance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api/auth`,
  timeout: 1000,
  withCredentials: true,
})

AuthInstance.interceptors.request.use(
  (config) => {
    if (!store) return config

    const { authState } = store.getState()
    const { token } = authState
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

AuthInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalConfig: AxiosRequestConfig & { retry?: boolean } = err.config

    if (err.response) {
      // token was expired
      if (
        err.response.status === 401 &&
        !originalConfig.retry &&
        originalConfig.url !== '/refresh-token'
      ) {
        originalConfig.retry = true

        const [error, res] = await to<AxiosResponse<AuthResponse>, AxiosError>(
          getRefreshToken()
        )

        if (error) {
          if (error.response && error.response.data) {
            return Promise.reject(error.response.data)
          }

          return Promise.reject(error)
        }
        if (!res) return
        const { token } = res.data
        if (store && setToken) store.dispatch(setToken({ token }))
        AuthInstance.defaults.headers.common.Authorization = `Bearer ${token}`

        return AuthInstance(originalConfig)
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data)
      }
    }

    return Promise.reject(err)
  }
)

export const register = ({ email, password }: IUserAuth) =>
  AuthInstance.post<AuthResponse>('/register', { email, password })

export const login = ({ email, password }: IUserAuth) =>
  AuthInstance.post<AuthResponse>('/login', { email, password })

// avoid infinite loops when refresh token request fails
export const getRefreshToken = () =>
  AuthInstance.post<AuthResponse>('/refresh-token')

export const getUser = () => AuthInstance.get<Pick<AuthResponse, 'user'>>('/me')

export const logout = () => AuthInstance.post('/logout')
