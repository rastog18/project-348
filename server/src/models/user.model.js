import { model, Schema, SchemaTypes } from 'mongoose'

const UserSchema = new Schema({
  firstName: {
    type: SchemaTypes.String,
    required: true,
  },
  lastName: SchemaTypes.String,
})

const User = model('user', UserSchema)

export default User
