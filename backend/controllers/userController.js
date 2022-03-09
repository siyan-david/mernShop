import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

/* 
@desc  Auth user & get tokens
@route POST /api/users/login
@access Public
*/
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  //  matching the plain text to the encrypted password
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401) //unauthorized
    throw new Error('Invalid email and password')
  }
})

export { authUser }
