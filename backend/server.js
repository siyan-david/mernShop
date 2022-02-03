import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
// import products from './data/products.js'
import productRoute from './routes/productRoute.js'

dotenv.config()
connectDB()

const app = express()

app.get('/', (req, res) => {
  res.send('API is running...')
})

app.use('/api/products', productRoute)

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

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`.yellow.bold)
})
