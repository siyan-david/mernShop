import multer from 'multer'
// import sharp from 'sharp/lib/sharp'
import path from 'path'
// multer storage configuration engine
// const MIME_TYPE = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})
const checkFileType = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/
  const mimetype = filetypes.test(file.mimetype)
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  )
  if (mimetype && extname) {
    return cb(null, true)
  }
  cb('Error: Images Only!')
}

const maxSize = 5 * 1024 * 10244 //5mb

const upload = multer({
  limits: maxSize,
  storage: storage,
  fileFilter: checkFileType,
})

export default upload
