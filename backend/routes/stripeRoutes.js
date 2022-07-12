import express from 'express'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_KEY)
const router = express.Router()

/* 
@desc Update order to paid
@route POST /api/checkout/stripe-payment
@access Public
*/

router.post('/stripe-payment', (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'ngn',
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr)
      } else {
        res.status(200).json(stripeRes)
      }
    }
  )
})

export default router
