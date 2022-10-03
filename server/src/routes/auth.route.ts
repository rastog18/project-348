import { verifyUser } from 'config/auth'
import {
  getUser,
  login,
  logout,
  refreshToken,
  register,
} from 'controllers/auth.controller'
import { Router } from 'express'
import passport from 'passport'

const authRouter = Router()

authRouter.post('/login', passport.authenticate('local'), login)
authRouter.post('/register', register)
authRouter.get('/me', verifyUser, getUser)
authRouter.post('/refreshToken', refreshToken)
authRouter.post('/logout', verifyUser, logout)

export default authRouter
