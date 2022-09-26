const express = require('express')
const ProductSchema = require('../models/product.models.js')
const Bussiness = require('../models/bussiness.model.js')
const router = express.Router()
const upload = require('../utils/multer.js')
const cloudinary = require('../utils/cloudinary.js')

/// Create product
router.post('/product', upload.single('image'), async (req, res, next) => {
  const { body } = req
  const { // aqui recibimos los datos que vienen en el body
    name,
    price,
    amount,
    description,
    businessId
  } = body

  if (!req.file) {
    return res.send('Por favor Selecione una foto')
  }

  const bussiness = await Bussiness.findById(businessId) // aqui estoy recuperando la empresa a la cual al cual pertenece este producto.

  try {
    const cloudinaryImage = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'Prolife Picturs Suitte'
    })
    // aqui vienen los datos que se van a gurdar en la base de datos.
    const product = new ProductSchema({
      name,
      price,
      amount,
      description,
      image: {
        public_id: cloudinaryImage.public_id,
        url: cloudinaryImage.secure_url
      },
      businessId: bussiness._id,
      active: true,
      createDate: new Date(),
      updateDate: new Date()
    })
    const saveProduct = await product.save() // aqui estamos generando el documento con la nueva empesa.

    bussiness.productsId = bussiness.productsId.concat(saveProduct._id)// aqui estamos asignando el id de las empresa a su respectivo producto( se concatena con los otras posibles id que pueda tener)

    await bussiness.save()

    res.json(saveProduct)
  } catch (error) {
    next(error)
  }
}) /* http://localhost:3001/api/product
{ este es objeto que tenemos que pasarle para poder crear una producto.
    "name": "arroz",
    "price": 2000,
    "amount": 100,
    "description": "Productos de preuba",
    "image": "selecione una imagen",
    "businessId" : "id de la empresa",
} */

// Get all product
router.get('/product', async (req, res, next) => {
  try {
    const product = await ProductSchema.find({}).populate('businessId' /* aqui le pasamos el campo al cual estamos haciendo referncia en el modelo */, {
      // y aqui le estamos pasando los campos que queremos ver de el modelo en referencia. el 1 es para visualizar y el 0 para ocultar.
      name: 1,
      phone: 1,
      adress: 1,
      email: 1,
      _id: 0
    })

    res.json(product)
  } catch (error) {
    next(error)
  }
}) // http://localhost:3001/api/product => url para el endpoint

// Get bussiness by id
router.get('/product/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const product = await ProductSchema.findById(id).populate('businessId' /* aqui le pasamos el campo al cual estamos haciendo referncia en el modelo */, {
      // y aqui le estamos pasando los campos que queremos ver de el modelo en referencia. el 1 es para visualizar y el 0 para ocultar.
      name: 1,
      phone: 1,
      adress: 1,
      email: 1,
      _id: 0
    })
    res.json(product)
  } catch (error) {
    next(error)
  }
}) // http://localhost:3001/api/product/id que se busca => url para el endpoint

// PUT(actualizar) product
router.put('/product/:id', async (req, res, next) => {
  const { id } = req.params
  const {
    name,
    price,
    amount,
    description,
    image,
    businessId,
    active,
    createDate
  } = req.body
  try {
    await ProductSchema
      .updateOne({ _id: id }, {
        $set: {
          name,
          price,
          amount,
          description,
          image,
          businessId,
          active,
          createDate,
          updateDate: new Date()
        }
      }) // metodo para actualizar un documento

    return res.status(200).json({ Message: 'Updated successfully' })
  } catch (error) {
    next(error)
  }
  /* http://localhost:3001/api/product/id que se va actualizar => url para el endpoint */
})

// Delete product
router.delete('/product/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await ProductSchema
      .findByIdAndRemove(id) // metodo para eliminar un documento
    return res.json({ Message: 'removed completely' }).status(204)
  } catch (error) {
    next(error)
  }
}) // http://localhost:3001/api/product/id que se va actua eliminar => url para el endpoint

module.exports = router
