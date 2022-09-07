const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const bussinessySchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  image: String,
  description: String,
  phone: {
    type: String,
    unique: true,
    minWidth: 10
  },
  adress: String,
  email: {
    type: String,
    unique: true
  },
  passwordHash: {
    type: String,
    minWidth: 8,
    maxWidth: 16
  },
  nit: {
    type: String,
    unique: true
  },
  productsId: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  active: Boolean,
  createDate: Date,
  updateDate: Date
})

bussinessySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

bussinessySchema.plugin(uniqueValidator)

const Business = model('Business', bussinessySchema)

module.exports = Business
