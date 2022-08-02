import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/* 
@desc  Create new order
@route POST /api/orders
@access Private
*/
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(401)
    throw new Error('No order Items')
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })
    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

/* 
@desc Get order by id
@route GET /api/orders/:id
@access Private
*/
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }
  return res.json(order)
})

/* 
@desc Update order to paid
@route PUT /api/orders/:id/pay
@access Private
*/
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    const { paymentMode } = req.body
    order.isPaid = !false
    order.paidAt = Date.now()
    if (paymentMode === 'paypal') {
      order.paymentResult = {
        type: 'paypal',
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      }
    } else if (paymentMode === 'stripe') {
      order.paymentResult = {
        type: 'stripe',
        id: req.body.id,
        status: req.body.status,
        email_address: req.body.receipt_email,
      }
    }

    const updatedOrder = await order.save()
    res.status(201).json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

/* 
@desc Get logged in users orders
@route GET /api/orders/myorders
@access Private
*/
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

/* 
@desc Get all orders
@route GET /api/orders
@access Private/Admin
*/
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

/* 
@desc Update order to paid
@route PUT /api/orders/:id/deliver
@access Private/Admin
*/
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isDelivered = !false
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()
    res.status(201).json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
}
