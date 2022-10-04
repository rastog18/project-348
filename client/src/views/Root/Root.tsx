import { Container } from '@mui/material'
import * as React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Main from 'views/Main'
import { Auth, Login, Me, Register } from 'views/Tutorial/Auth'
import Axios from 'views/Tutorial/Axios'
import Redux from 'views/Tutorial/Redux'

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path="axios" element={<Axios />} />
        <Route path="redux" element={<Redux />} />
        <Route path="auth">
          <Route index element={<Auth />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="me" element={<Me />} />
        </Route>

        <Route path="*" element={<Container sx={{ p: 5 }}>404</Container>} />
      </Routes>
    </BrowserRouter>
  )
}
