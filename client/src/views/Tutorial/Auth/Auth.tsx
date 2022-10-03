import { Box, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Auth() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4">Auth Tutorial</Typography>
      <Box sx={{ mt: 4 }}>
        <ul>
          <li>
            <Link to="/auth/login">Login</Link>
          </li>
          <li>
            <Link to="/auth/register">Register</Link>
          </li>
          <li>
            <Link to="/auth/me">Me (protected)</Link>
          </li>
        </ul>
      </Box>
    </Container>
  )
}
