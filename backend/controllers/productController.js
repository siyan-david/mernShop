import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

/* 
@desc  Fetch all products
@route GET /api/products
@access Public
*/
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  res.json(products)
})

/* 
@desc  Fetch all products
@route GET /api/admin/products
@access Private/Admin
*/
const getProductsByAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  res.json(products)
})

/* 
@desc  Fetch single products
@route GET /api/products/:id
@access Public
*/

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

/* 
@desc  Delete a products
@route DELETE /api/products/:id
@access Private/Admin
*/
const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    if (product.user.equals(req.user._id)) {
      await product.remove()
      res.json({ message: 'Product removed' })
    }
    res.status(401)
    throw new Error('Unauthorized')
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

/* 
@desc  Create a products
@route POST /api/products/
@access Private/Admin
*/

const createProduct = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(442)
      throw new Error('No Image provided!')
    }
    // const imagePath = req.path.replace(/\\/g, 'uploads/')
    const product = new Product({
      name: req.body.name,
      user: req.user._id,
      price: req.body.price,
      // image: imagePath,
      image: req.file.path,
      brand: req.body.brand,
      category: req.body.category,
      countInStock: req.body.countInStock,
      description: req.body.description,
    })
    res.json(product)
    const createdProducts = product.save()
    if (createdProducts) {
      res.status(201).json({ message: 'Product created successfully' })
    }
    res.status(404).json({ message: 'Unsuccessful' })
  } catch (error) {
    if (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
    next(error)
  }
  // res.send(`/${req.file.path}`)
  // res.send(req.file.path)
})

// const createProduct = asyncHandler(async (req, res) => {
//   const product = new Product({
//     name: 'Sample Product',
//     price: 0,
//     user: req.user._id,
//     image: '/images/sample.jpg',
//     brand: 'Product Brand',
//     category: 'Product Category',
//     countInStock: 0,
//     numReviews: 0,
//     description: 'Product Description',
//   })

//   const createdProduct = await product.save()
//   if (!createdProduct) {
//     res.status(404).json({ message: 'Error creating product' })
//   }
//   res
//     .status(200)
//     .json({ message: 'Product created successfully', createdProduct })
// })

/* 
@desc  Update a product
@route PUT /api/products/:id
@access Private/Admin
*/
const updateProduct = asyncHandler(async (req, res) => {
  /*
  const { name, price, brand, category, countInStock, description } = req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    product.name = name
    product.price = price
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.description = description
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } else {
    res.status(404).json({ message: 'Error updating product' })
    throw new Error('Product not found')
  }
*/

  const product = await Product.findById(req.params.id)
  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    { $set: { ...req.body }, image: req.file.image },
    { new: true }
  )
  if (!product) {
    res.status(404)
    throw new Error(`No product found: ${req.params.id}`)
  }
  return res.status(200).json(updatedProduct)
})

export {
  getProducts,
  getProductsByAdmin,
  getProductById,
  deleteProductById,
  createProduct,
  updateProduct,
}
