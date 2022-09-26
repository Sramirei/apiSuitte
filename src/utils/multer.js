const multer = require('multer')

// modulo path es para manejar la rutas de nuestro pc
// y nuestro proyecto
const path = require('path')

// multer config
module.exports = multer({
  // para decirle a multer donde guardar el archivo, en este caso esta vacio porque lo subiremos a cloudinary
  storage: multer.diskStorage({}),
  // funcion para controlar que archivos son aceptados
  fileFilter: (req, file, cb) => {
    // originalmente es el nombre del archivo en la computadora
    const ext = path.extname(file.originalname)

    // la funcion debe llamar al cb usando una variable tipo boleana para indicar si el archivo cdeberia ser aceptado o no
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      // para rechazar el archivo es necesario el 'false'
      cb(
        new Error(
          'El formato de la foto no es soportado'
        ), false
      )
    }

    // para aceptar el archivo es necesario pasar true
    cb(null, true)
  }
})
