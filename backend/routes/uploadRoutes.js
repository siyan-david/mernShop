import express from 'express'
import upload from '../middleware/fileUpload.js'
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/', protect, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router
