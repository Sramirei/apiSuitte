const express = require('express')
const UserSchema = require('../models/user.model.js') // siempre poner la extencion del archivo
const bcrypt = require('bcrypt')
const router = express.Router()
const upload = require('../utils/multer.js')
const cloudinary = require('../utils/cloudinary.js')

// Create User
router.post('/user', upload.single('image'), async (req, res, next) => {
  const { body } = req
  const { username, email, password, name, address, phone, dni } = body

  if (!req.file) {
    return res.send('Por favor Selecione una foto')
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  try {
    const cloudinaryImage = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'Prolife Picturs Suitte'
    })
    const user = new UserSchema({
      username,
      email,
      passwordHash,
      name,
      address,
      phone,
      dni,
      image: {
        public_id: cloudinaryImage.public_id,
        url: cloudinaryImage.secure_url
      },
      active: true,
      createDate: new Date(),
      updateDate: new Date()
    })
    const saveUser = await user.save()
    res.json(saveUser).status(201)
  } catch (error) {
    next(error)
  }
}) /* http://localhost:9000/api/user
{ este es el objeto que se debe enviar para poder crear un usuario.
    "username": "nicolas",
    "email": "cinicolas@mail.com",
    "password": "Sebastian",
    "name": "sebasdas23",
    "address": "calle siempre viva 123",
    "phone": "3125444532",
    "dni": "1234545345",
}
*/

// Get all users
router.get('/user', async (req, res, next) => {
  const users = await UserSchema.find({})
  res.json(users)
  // respuesta si no se guarda
}) // http://localhost:9000/api/user

// Get users by id
router.get('/user/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await UserSchema.findById(id) // metodo para obtener usuario por id
    res.json(user)
  } catch (error) {
    next(error)
  }
}) // http://localhost:9000/api/user/id que se busca

// PUT(actualizar) user
router.put('/user/:id', async (req, res, next) => {
  const { id } = req.params
  const { username, email, password, name, address, phone, dni, active, createDate } = req.body
  try {
    await UserSchema
      .updateOne({ _id: id }, { $set: { username, email, password, name, address, phone, dni, active, createDate, updateDate: new Date() } }) // metodo para actualizar un documento

    return res.status(200).json({ Message: 'Updated successfully' })
  } catch (error) {
    next(error)
  }
  // respuesta si no se Acutaliza
  /* http://localhost:9000/api/user/id que se va a actualizar
{
     "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
     "upsertedCount": 0,
    "matchedCount": 1
} */
})

// Delete user
router.delete('/user/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await UserSchema
      .findByIdAndRemove(id) // metodo para eliminar un documento
    res.status(204).end()
  } catch (error) {
    next(error)
  }
  // respuesta si no se elimina
}) // http://localhost:9000/api/user/id que se va a actualizar

module.exports = router
