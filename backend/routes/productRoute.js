import express from 'express'
// import asyncHandler from 'express-async-handler'
// import Product from '../models/productModel.js'
import {
  getProducts,
  getProductById,
  getTopProducts,
  deleteProductById,
  createProduct,
  createProductReview,
  updateProduct,
} from '../controllers/productController.js'

import upload from '../middleware/fileUpload.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

/* 
@desc  Fetch all products
@route GET /api/products
@access Public
*/

/*
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({})
    // console.log(products)
    // throw new Error('Some Error')
    res.json(products)
  })
)

*/
//********************************* */

router.route('/').get(getProducts)
router.post('/', upload.single('image'), protect, admin, createProduct)
router.get('/top', getTopProducts)

router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProductById)
  .patch(protect, admin, updateProduct)

router.route('/:id/reviews').post(protect, createProductReview)

/* 
@desc  Fetch single products
@route GET /api/products/:id
@access Public
*/

/*
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    // const product = products.find((p) => p._id === req.params.id)
    const product = await Product.findById(req.params.id)

    if (product) {
      res.json(product)
    } else {
      // res.status(404).json({ message: 'Product not found' })
      res.status(404)
      throw new Error('Product not found')
    }
  })
)
*/

export default router
