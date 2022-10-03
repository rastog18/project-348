import to from 'await-to-js'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMatch, useNavigate } from 'react-router-dom'
import type { DispatchType } from 'store'
import { authStateSelector, UserState } from 'store/slices/authSlice'
import { getUser, logout as _logout } from 'store/thunks/authThunk'

const useUserAuth = () => {
  const dispatch = useDispatch<DispatchType>()
  const navigate = useNavigate()
  const isLoginPage = useMatch('/auth/login')

  const { user, loading, state } = useSelector(authStateSelector)

  const checkAuthStatus = useCallback(async () => {
    const [error, res] = await to(dispatch(getUser()).unwrap())

    if (error) throw new Error(error.message)

    return res
  }, [dispatch])

  const logout = useCallback(async () => {
    const [err] = await to(dispatch(_logout()).unwrap())
    if (err) console.log(err)

    navigate('/auth/login')
  }, [dispatch, navigate])

  useEffect(() => {
    if (state === UserState.NONE)
      checkAuthStatus().catch(() => {
        if (!isLoginPage) {
          navigate('/auth/login')
        }
      })
  }, [checkAuthStatus, navigate, isLoginPage, state])

  return { user, logout, loading, checkAuthStatus }
}

export default useUserAuth
