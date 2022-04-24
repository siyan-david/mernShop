import express from 'express'
import upload from '../middleware/fileUpload.js'

const router = express.Router()

router.patch('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router
