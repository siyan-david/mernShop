import express from 'express'
import { getProductsByAdmin } from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()

router.get('/', protect, admin, getProductsByAdmin)
export default router
