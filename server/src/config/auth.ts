import jwt from 'jsonwebtoken'
import ms from 'ms'
import passport from 'passport'

import type { CookieOptions, NextFunction, Request, Response } from 'express'

const dev = process.env.NODE_ENV !== 'production'

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  // Since localhost is not having https protocol, secure cookies does not work correctly
  secure: !dev,
  signed: true,
  maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY || '30d'),
}

export const getToken = (user: SignedUser) =>
  jwt.sign(user, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.SESSION_EXPIRY || '15m',
  })

export const getRefreshToken = (user: SignedUser) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET || 'secret', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d',
  })

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies
  if (!refreshToken) res.status(401).send('Unauthorized')
  else passport.authenticate('jwt', { session: false })(req, res, next)
}
