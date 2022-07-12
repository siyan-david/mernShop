import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
// import products from './data/products.js'
import productRoute from './routes/productRoute.js'
import productAdmin from './routes/productAdminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import stripeRoutes from './routes/stripeRoutes.js'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV

//body parser

if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.get('/', (req, res) => {
  res.send('API is running...')
})

app.use(express.json())

app.use('/api/products', productRoute)
app.use('/api/admin/products', productAdmin)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/checkout', stripeRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

app.use('/api/config/paystack', (req, res) => {
  res.send(process.env.PAYSTACK_PUBLIC_KEY)
  // console.log(process.env.PAYSTACK_PUBLIC_KEY)
})

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// custom 404 error middleware
app.use(notFound)

// Error Handler to change error message from default html to JSON
app.use(errorHandler)

/*
Moved to the routes/productRoute
app.get('/api/products', (req, res) => {
  res.json(products)
})
app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p._id === req.params.id)
  res.json(product)
})
*/

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`.yellow.bold)
})
