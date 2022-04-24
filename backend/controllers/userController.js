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

  //  matching user and also the plain text to the encrypted password
  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user._id,
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

/* 
@desc  Register a new user
@route POST /api/users
@access Public
*/
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExits = await User.findOne({ email })

  if (userExits) {
    res.status(400)
    throw new Error('User already exits')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

/* 
@desc  Get user profile
@route GET /api/users/profile
@access Private
*/
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }

  // res.send('Success')
})

/* 
@desc  Update user profile
@route PUT /api/users/profile
@access Private
*/
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  const { name, email, password } = req.body
  if (user) {
    user.name = name || user.name
    user.email = email || user.email
    if (password) {
      user.password = password
    }
    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

/* 
@desc  Get all users
@route GET /api/users
@access Private/Admin
*/
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

/* 
@desc  Delete a user
@route DELETE /api/users/:id
@access Private/Admin
*/
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    if (user) await user.remove()
    res.status(200).json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

/* 
@desc  Get all user by id
@route GET /api/users/:id
@access Private/Admin
*/
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    throw new Error('User not found')
  }
})

/* 
@desc  Update users
@route PATCH /api/users/:id
@access Private/Admin
*/

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $set: req.body },
    { new: true }
  ).select('-password')
  res.json(updatedUser)
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
