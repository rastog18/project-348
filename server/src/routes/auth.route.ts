import { Router } from 'express'
import passport from 'passport'

import { verifyUser } from '@/config/auth'
import {
  getUser,
  login,
  logout,
  refreshToken,
  register,
} from '@/controllers/auth.controller'

const authRouter = Router()

authRouter.post('/login', passport.authenticate('local'), login)
authRouter.post('/register', register)
authRouter.get('/me', verifyUser, getUser)
authRouter.post('/refresh-token', refreshToken)
authRouter.post('/logout', verifyUser, logout)

export default authRouter
