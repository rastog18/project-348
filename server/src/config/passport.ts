import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import UserAuth from 'models/userAuth.model'
import to from 'await-to-js'

// https://github.com/jwalton/passport-api-docs

export default () => {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'secret',
      },
      async (payload: SignedUser, done) => {
        const [err, user] = await to(UserAuth.findById(payload._id).exec())

        if (err) return done(err, false)
        if (user) return done(null, user)
        return done(null, false)
      }
    )
  )
  passport.use(UserAuth.createStrategy())
  passport.serializeUser(UserAuth.serializeUser() as any)
  passport.deserializeUser(UserAuth.deserializeUser())
}
