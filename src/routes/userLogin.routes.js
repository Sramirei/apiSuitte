const jwt = require('jsonwebtoken')
const express = require('express')
const UserSchema = require('../models/user.model.js') // siempre poner la extencion del archivo
const bcrypt = require('bcrypt')
const router = express.Router()

router.post('/login', async (req, res) => {
  const { body } = req
  const { username, password } = body

  const user = await UserSchema.findOne({ username })
  const passworCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passworCorrect)) {
    res.status(401).json({
      error: 'Invalid user or Password'
    })
  }
  const userForToken = {
    id: user._id,
    name: user.name,
    username: user.username
  }

  const token = jwt.sign(userForToken,
    process.env.SECRET, {
      expiresIn: 60 * 60 * 24 * 7
    }
  )

  res.status(200).json({
    name: user.name,
    username: user.username,
    token
  })
})

module.exports = router
