import { model, Schema, SchemaTypes } from 'mongoose'
import type { IUser } from 'types/types'

const UserSchema = new Schema<IUser>({
  firstName: {
    type: SchemaTypes.String,
    required: true,
  },
  lastName: SchemaTypes.String,
})

const User = model('user', UserSchema)

export default User
