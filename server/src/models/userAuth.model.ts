import passportLocalMongoose from 'passport-local-mongoose'
import { model, Schema, SchemaTypes } from 'mongoose'
import omit from 'lodash/omit'
import type { IUserAuth } from 'types/types'

const UserAuthSchema = new Schema<IUserAuth>({
  email: {
    type: SchemaTypes.String,
    required: true,
  },
  refreshTokens: [SchemaTypes.String],
})

UserAuthSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
})

/**
 * remove fields that we don't need to send over
 * i.e. fields that only the backend uses
 *
 * the ONLY problem is that .lean() doesn't call toJSON, meaning you'll have to manually remove unwanted fields
 * unless we create a plugin that does that...
 */
UserAuthSchema.set('toJSON', {
  transform: (doc, ret: IUserAuth) =>
    omit(ret, ['refreshTokens', 'salt', 'hash']),
})
const UserAuth = model('userAuth', UserAuthSchema)

export default UserAuth
