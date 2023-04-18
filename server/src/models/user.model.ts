import { Schema, SchemaTypes, model } from 'mongoose'

import type { Model } from 'mongoose'
import type { IUser } from '@/types/types'

const UserSchema = new Schema<IUser>({
  firstName: {
    type: SchemaTypes.String,
    required: true,
  },
  lastName: SchemaTypes.String,
})

// need to re-type User model since passport plugin overrides default type for models
const User = model('user', UserSchema) as Model<IUser>

export default User
