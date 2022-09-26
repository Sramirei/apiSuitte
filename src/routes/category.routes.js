const express = require('express')
const CategorySchema = require('../models/category.model.js')
const router = express.Router()
const upload = require('../utils/multer.js')
const cloudinary = require('../utils/cloudinary.js')

/// Create category
router.post('/category', upload.single('image'), async (req, res, next) => {
  const { body } = req
  const {
    name, description, bussinessId
  } = body

  if (!req.file) {
    return res.send('Por favor Selecione una foto')
  }

  try {
    const cloudinaryImage = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'Prolife Picturs Suitte'
    })
    const category = new CategorySchema({
      name,
      image: {
        public_id: cloudinaryImage.public_id,
        url: cloudinaryImage.secure_url
      },
      description,
      bussinessId,
      active: true,
      createDate: new Date(),
      updateDate: new Date()
    })
    const saveCategory = await category.save()
    res.json(saveCategory)
  } catch (error) {
    next(error)
  }
}) /* http://localhost:9000/api/category
{
    "name":"foods",
    "image": "selecione una imagen",
    "description": "prueba de crar categoria"
} */

// Get all categor
router.get('/category', async (req, res, next) => {
  try {
    const category = await CategorySchema.find({})
    res.json(category)
  } catch (error) {
    next(error)
  }
}) // http://localhost:3001/api/category => url para el endpoint

// Get category by id
router.get('/category/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const category = await CategorySchema.findById(id) // metodo para obtener category por id
    res.json(category)
  } catch (error) {
    next(error)
  }
}) // http://localhost:3001/api/category/id que se busca => url para el endpoint

// PUT(actualizar) category --> de le debe enviar solo json para hacer la actualizacion
router.put('/category/:id', async (req, res, next) => {
  const { id } = req.params
  const {
    name, image, description, productsId, active, createDate
  } = req.body
  try {
    await CategorySchema
      .updateOne({ _id: id }, { $set: { name, image, description, productsId, active, createDate, updateDate: new Date() } }) // metodo para actualizar un documento

    return res.status(200).json({ Message: 'Updated successfully' })
  } catch (error) {
    next(error)
  }
  /* http://localhost:3001/api/category/id que se va actualizar => url para el endpoint */
})

// Delete category
router.delete('/category/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await CategorySchema
      .findByIdAndRemove(id) // metodo para eliminar un documento
    return res.json({ Message: 'removed completely' }).status(204)
  } catch (error) {
    next(error)
  }
}) // http://localhost:3001/api/category/id que se va actua eliminar => url para el endpoint

module.exports = router
