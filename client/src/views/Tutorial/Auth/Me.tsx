import { Box, Button, Container, Typography } from '@mui/material'

import useUserAuth from 'hooks/useUserAuth'

const Me = () => {
  const { user, logout } = useUserAuth()

  return (
    <Container sx={{ py: 5 }}>
      <Box my={4}>
        <Typography variant="h5">Me</Typography>
        <Typography>{user?.email}</Typography>
      </Box>
      <Button variant="contained" onClick={logout}>
        Logout
      </Button>
    </Container>
  )
}

export default Me
