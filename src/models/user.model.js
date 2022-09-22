const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  passwordHash: String,
  name: String,
  address: String,
  phone: {
    type: String,
    unique: true
  },
  dni: {
    type: String,
    unique: true
  },
  image: {
    public_id: String,
    url: String
  },
  active: Boolean,
  createDate: Date,
  updateDate: Date
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User
