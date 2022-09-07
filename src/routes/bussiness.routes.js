const express = require('express')
const bcrypt = require('bcrypt')
const BussinessSchema = require('../models/bussiness.model.js')
const router = express.Router()

/// Create bussiness
router.post('/bussiness', async (req, res, next) => {
  const { body } = req
  const { // aqui recibimos los datos que vienen en el body
    name,
    image,
    description,
    phone,
    adress,
    email,
    password,
    nit,
    productsId
  } = body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // aqui vienen los datos que se van a gurdar en la base de datos.
  const bussiness = new BussinessSchema({
    name,
    image,
    description,
    phone,
    adress,
    email,
    passwordHash,
    nit,
    productsId,
    active: true,
    createDate: new Date(),
    updateDate: new Date()
  })

  try {
    const saveBussiness = await bussiness.save() // aqui estamos generando el documento con la nueva empesa.

    res.json(saveBussiness)
  } catch (error) {
    next(error)
  }
}) /* http://localhost:3001/api/bussiness
{ este es objeto que tenemos que pasarle para poder crear una empresa.
    "name": "super ",
    "image": "imagen de prueba",
    "description": "Prueba de bussines",
    "phone": "31276455455",
    "adress": "calle siempre viva 123",
    "email": "prueba7@gmail.com",
    "password": "cualqueircosa",
    "nit": "242423424-7"
} */

// Get all bussiness
router.get('/bussiness', async (req, res, next) => {
  try {
    const bussiness = await BussinessSchema.find({})
    res.json(bussiness)
  } catch (error) {
    next(error)
  }
}) // http://localhost:3001/api/bussiness => url para el endpoint

// Get bussiness by id
router.get('/bussiness/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const bussiness = await BussinessSchema.findById(id)
    res.json(bussiness)
  } catch (error) {
    next(error)
  }
}) // http://localhost:3001/api/bussiness/id que se busca => url para el endpoint

// PUT(actualizar) bussiness
router.put('/bussiness/:id', async (req, res, next) => {
  const { id } = req.params
  const {
    name,
    image,
    description,
    phone,
    adress,
    email,
    passwordHash,
    nit,
    productsId,
    active,
    createDate
  } = req.body
  try {
    await BussinessSchema
      .updateOne({ _id: id }, {
        $set: {
          name,
          image,
          description,
          phone,
          adress,
          email,
          passwordHash,
          nit,
          productsId,
          active,
          createDate,
          updateDate: new Date()
        }
      }) // metodo para actualizar un documento

    return res.status(200).json({ Message: 'Updated successfully' })
  } catch (error) {
    next(error)
  }
  /* http://localhost:3001/api/bussiness/id que se va actualizar => url para el endpoint */
})

// Delete bussiness
router.delete('/bussiness/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await BussinessSchema
      .findByIdAndRemove(id) // metodo para eliminar un documento
    return res.json({ Message: 'removed completely' }).status(204)
  } catch (error) {
    next(error)
  }
}) // http://localhost:3001/api/bussiness/id que se va actua eliminar => url para el endpoint

module.exports = router
