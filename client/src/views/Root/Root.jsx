import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Container } from '@mui/material'
import Main from 'views/Main'
import Axios from 'views/Tutorial/Axios'
import Redux from 'views/Tutorial/Redux'

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/axios" element={<Axios />} />
        <Route exact path="/redux" element={<Redux />} />
        <Route path="*" element={<Container sx={{ p: 5 }}>404</Container>} />
      </Routes>
    </BrowserRouter>
  )
}
