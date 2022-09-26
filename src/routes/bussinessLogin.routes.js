const jwt = require('jsonwebtoken')
const express = require('express')
const bussinessSchema = require('../models/bussiness.model.js') // siempre poner la extencion del archivo
const bcrypt = require('bcrypt')
const router = express.Router()

router.post('/bussnesslogin', async (req, res) => {
  const { body } = req
  const { email, password } = body

  const bussiness = await bussinessSchema.findOne({ email })
  const passworCorrect = bussiness === null
    ? false
    : await bcrypt.compare(password, bussiness.passwordHash)

  if (!(bussiness && passworCorrect)) {
    res.status(401).json({
      error: 'Invalid user or Password'
    })
  }
  const bussinesForToken = {
    id: bussiness._id,
    name: bussiness.name,
    email: bussiness.email,
    phone: bussiness.phone,
    adress: bussiness.adress,
    nit: bussiness.nit,
    image: bussiness.image,
    description: bussiness.description,
    productsId: bussiness.productsId,
    categoryId: bussiness.categoryId
  }

  const token = jwt.sign(bussinesForToken,
    process.env.SECRET, {
      expiresIn: 60 * 60 * 24 * 7
    }
  )

  res.status(200).json({
    name: bussiness.name,
    email: bussiness.email,
    token
  })
})

module.exports = router
