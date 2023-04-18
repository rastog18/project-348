import type { Document, PassportLocalDocument } from 'mongoose'

type Session = string

interface IUser extends Document {
  firstName: string
  lastName?: string
}

interface IUserAuth extends PassportLocalDocument {
  email: string
  password: string
  refreshTokens: Session[]
}
