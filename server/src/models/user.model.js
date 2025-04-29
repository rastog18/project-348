import mongoose from 'mongoose';

const { model, Schema, SchemaTypes } = mongoose;


const UserSchema = new Schema({
  firstName: {
    type: SchemaTypes.String,
    required: true,
  },
  lastName: {
    type: SchemaTypes.String,
  },
  puid: {
    type: SchemaTypes.String,
    required: true,
    unique: true, // Unique index for PUID
  },
  dormName: {
    type: SchemaTypes.String,
    index: true, // Index for dormName
  },
  dob: {
    type: SchemaTypes.Date,
    required: true,
    index: true, // Index for date of birth
  },
  collegeYear: {
    type: SchemaTypes.String,
    enum: ['Freshman', 'Sophomore', 'Junior', 'Senior'], // Helps avoid typos
    index: true, // Index for collegeYear
  },
})

// Compound index for queries involving dormName and collegeYear
UserSchema.index({ dormName: 1, collegeYear: 1 })

const User = model('user', UserSchema)

export default User
