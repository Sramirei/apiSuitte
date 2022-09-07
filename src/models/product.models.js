const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  price: Number,
  amount: Number,
  description: String,
  image: String,
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business'
  },
  active: Boolean,
  createDate: Date,
  updateDate: Date
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

productSchema.plugin(uniqueValidator)

const Product = model('Product', productSchema)

module.exports = Product
