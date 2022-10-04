import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import to from 'await-to-js'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { register } from 'store/thunks/authThunk'

import type { DispatchType } from 'store'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<DispatchType>()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const onRegister = async () => {
    if (!email || !password) return

    const [err] = await to(dispatch(register({ email, password })).unwrap())

    if (err && err.name === 'UserExistsError') {
      setErrorMessage('Account with email already exists')
      return
    }

    navigate('/auth/me')
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h5">Register</Typography>
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
          onChange={(e) => setPassword(e.target.value.trim())}
          sx={{ width: '300px' }}
        />

        <Box>
          <Button
            onClick={onRegister}
            variant="contained"
            color="success"
            sx={{ mx: 2 }}
          >
            Register
          </Button>
          <Button onClick={() => navigate('/auth/login')} variant="contained">
            Go to login
          </Button>
        </Box>
      </Stack>
    </Container>
  )
}

export default Register
