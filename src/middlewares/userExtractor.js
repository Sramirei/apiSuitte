const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const auth = req.get('authorization') // aqui recuperamos la cabecera
  let token = null // aqui decimos que en principio el token es null

  if (auth && auth.toLowerCase().startsWith('bearer')) { // aqui le estamos pasando el metodo de autenficacion queremos
    token = auth.substring(7) // aqui estamos recuperando el token sin el metodo de autenticacion
  }

  const decodedToken = jwt.verify(token, process.env.SECRET) // este seria el arreglo con el cual vamos a desastruturar el token y extraer la infromacion.

  if (!token || !decodedToken.id) { /// aqui le decimos si no hay token o no hay un id en el token desestructurado.
    return res.status(401).json({ error: 'Token missing or invalid' })
  }
  const { id: userId } = decodedToken // recuperamos el id del usuario que esta logeado
  req.userId = userId

  next()
}
