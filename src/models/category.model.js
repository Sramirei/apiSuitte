const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  image: {
    public_id: String,
    url: String
  },
  description: String,
  bussinessId: [{
    type: Schema.Types.ObjectId,
    ref: 'Bussiness'
  }],
  active: Boolean,
  createDate: Date,
  updateDate: Date
})

categorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

categorySchema.plugin(uniqueValidator)

const Category = model('Category', categorySchema)

module.exports = Category
