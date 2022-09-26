const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const userRoutes = require('./routes/user.routes.js')
const productRoutes = require('./routes/product.routes.js')
const categoryRoutes = require('./routes/category.routes.js')
const bussinessRoutes = require('./routes/bussiness.routes.js')
const userLoginRoutes = require('./routes/userLogin.routes')
const bussinessLoginRoutes = require('./routes/bussinessLogin.routes.js')
const Sentry = require('@sentry/node')
const { BrowserTracing } = require('@sentry/tracing')
const handleErrors = require('./middlewares/handleErrors.js')
const hadelNotFound = require('./middlewares/hadelNotFound.js')

const app = express()

Sentry.init({
  dsn: 'https://e70f74e432454f02a47908916be43334@o1390846.ingest.sentry.io/6712349',

  // Alternatively, use `process.env.npm_package_version` for a dynamic release version
  // if your build tool supports it.
  release: 'my-project-name@2.3.12',
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0

})

// Setings
const port = process.env.PORT || 9000 // esta es la configuracion par apoder que tome el puerto por defecto que le asigne el servidor donde se suba y si no toma el puerto 9000 en el equipo.

// Midelware
app.use(cors())
app.use(morgan('dev')) // este es para ver en la consola las peticiones que se estan realizando al servidor
app.use(express.json()) // para convertir los datos que llegan a formato json
app.use(express.urlencoded({ extended: false })) // para que pueda leer documentos json que vengan desde formularios html

app.use('/api', userRoutes)
app.use('/api', productRoutes)
app.use('/api', categoryRoutes)
app.use('/api', bussinessRoutes)
app.use('/api', userLoginRoutes)
app.use('/api', bussinessLoginRoutes)

// modulos de sentry deben declararse antes de iniciar las rutas de nuestra api.
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// Routes
app.get('/', (req, res) => {
  // aqui usamos la las rutas que estamos exportando.
  res.send('Hello peter')
})

// manejo de errores

app.use(Sentry.Handlers.errorHandler()) // esto es para el manejo de sentry, debe declararse antes de cualquier middelware de manejo de errores.

app.use(handleErrors)
app.use(hadelNotFound)

// mongoDB connection
const { URI_MONGO, URI_MONGO_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test'
  ? URI_MONGO_TEST
  : URI_MONGO
mongoose
  .connect(connectionString) // aqui le pasamos una variable de entorno para poder protejer datows de acceso para la base de datos
  .then(() => console.log('Conect to mongo✔✔')) // aqui nos devuelve el mensaje de conexion
  .catch((error) => console.error(error)) // aqui nos avisa si hay cualquier error

const server = app.listen(port, () => console.log('Server on port', port, '✔✔'))

process.on('uncaughtException', () => {
  mongoose.connection.disconnet() // esto cierra la conexion en caso que haya un error que no permita seguir el proceso.
})

module.exports = { app, server }
