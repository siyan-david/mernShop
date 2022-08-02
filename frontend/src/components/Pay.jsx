import StripeCheckout from 'react-stripe-checkout'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap'
const KEY =
  'pk_test_51L1dNfF5w4dMwAahRxekeiX0HL5t7M31STT4D6eUlfy32AFDSEdFr8o3qIlj4ISGxsBM35rVW9G2s8zIy2EWdCVb00kuuwBoEv'
const Pay = () => {
  const [stripeToken, setStripeToken] = useState(null)

  const onToken = (token) => {
    setStripeToken(token)
  }
  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/checkout/stripe-payment',
          {
            tokenId: stripeToken.id,
            amount: 1000,
          }
        )
        console.log(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    makeRequest()
  }, [stripeToken])
  return (
    <div>
      <StripeCheckout
        name='Shop.'
        billingAddress
        shippingAddress
        description='Your total is $20'
        amount={1000}
        token={onToken}
        stripeKey={KEY}
      >
        <Button type='button' className='btn btn-block'>
          PAY NOW
        </Button>
      </StripeCheckout>
    </div>
  )
}

export default Pay
