import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

/* 
@desc  Fetch all products
@route GET /api/products
@access Public
*/
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
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
@desc  Create a products
@route POST /api/products/
@access Private/Admin
*/
const createProduct = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file
    if (!file) {
      res.status(404)
      throw new Error('No Image provided!')
    }
    const basePath = `${req.protocol}://${req.get('host')}/uploads/`
    const fileName = file.filename
    // const imgPath = req.path.(/\\/g, 'uploads/')
    // const imgPath = req.path.replace('\\', '/uploads')
    const product = new Product({
      name: req.body.name,
      user: req.user._id,
      price: req.body.price,
      image: `${basePath}${fileName}`,
      brand: req.body.brand,
      category: req.body.category,
      countInStock: req.body.countInStock,
      description: req.body.description,
    })
    console.log(product.image)
    res.json(product.image)
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
})

/* 
@desc  Update a product
@route PATCH /api/products/:id
@access Private/Admin
*/
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  // if (!req.file) return res.status(404).json({ message: 'No image provided' })
  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    { $set: { ...req.body } },
    { new: true }
  )
  if (!product) {
    res.status(404)
    throw new Error(`No product found: ${req.params.id}`)
  }
  return res.status(200).json(updatedProduct)
})

/* 
@desc  Create new review
@route POST /api/products/:id/reviews
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
@desc  Create new review
@route POST /api/products/:id/reviews
@access Private
*/
const createProductReview = asyncHandler(async (req, res) => {
  const productId = req.params.id
  const product = await Product.findById(productId)
  const { rating, comment } = req.body
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    res.json(alreadyReviewed)

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }
    // console.log(req.user)

    product.reviews.push(review)
    product.numReviews = product.reviews.length

    // Average overral rating
    product.rating =
      product.reviews.reduce((prev, item) => item.rating + prev, 0) /
      product.reviews.length
    const updatedProduct = await product.save()
    res.status(201).json({
      message: 'Review created',
      review: updateProduct.reviews[updatedProduct.reviews.length - 1],
      numReviews: product.numReviews,
      rating: product.rating,
    })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

/* 
@desc  Get top rated products
@ GET /api/products/top
@access Public
*/
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)
  res.json(products)
})

export {
  getProducts,
  getProductById,
  getTopProducts,
  deleteProductById,
  createProduct,
  createProductReview,
  updateProduct,
}
