import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import to from 'await-to-js'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { UserState, authStateSelector } from 'store/slices/authSlice'
import { getUser, login } from 'store/thunks/authThunk'

import type { DispatchType } from 'store'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<DispatchType>()

  const { state } = useSelector(authStateSelector)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (state !== UserState.IDLE) return
    ;(async () => {
      const [, res] = await to(dispatch(getUser()).unwrap())
      if (res) navigate('/auth/me')
    })()
  }, [dispatch, navigate, state])

  const onLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!email || !password) return

    const [err] = await to(dispatch(login({ email, password })).unwrap())
    if (err) {
      setErrorMessage('Invalid email or password')
    }
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h5">Login</Typography>
      <form onSubmit={onLogin}>
        <Stack my={3} spacing={3}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.trim())
              setErrorMessage('')
            }}
            error={Boolean(errorMessage)}
            sx={{ width: '300px' }}
            helperText={errorMessage}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value.trim())
              setErrorMessage('')
            }}
            error={Boolean(errorMessage)}
            sx={{ width: '300px' }}
            helperText={errorMessage}
          />

          <Box>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mx: 2 }}
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/auth/register')}
              variant="contained"
            >
              Go to register
            </Button>
          </Box>
        </Stack>
      </form>
    </Container>
  )
}

export default Login
