import to from 'await-to-js'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

// https://www.npmjs.com/package/axios-cache-adapter
// best to cache GET requests for better performance

export type Token = string

export type AuthResponse = { user: IUserAuth; token: Token }

const AuthInstance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api/auth`,
  timeout: 1000,
  withCredentials: true,
})

AuthInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mern-boilerplate-session-token')
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
        originalConfig.url !== '/refreshToken'
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
        localStorage.setItem('mern-boilerplate-session-token', token)
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
  AuthInstance.post<AuthResponse>('/refreshToken')

export const getUser = () => AuthInstance.get<Pick<AuthResponse, 'user'>>('/me')

export const logout = () => AuthInstance.post('/logout')
