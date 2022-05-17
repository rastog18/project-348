import type { Document } from 'mongoose'

interface IUser extends Document {
  firstName: string
  lastName?: string
}
