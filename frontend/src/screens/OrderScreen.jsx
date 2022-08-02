import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
// import PaystackPayment from '../components/PaystackPayment'
import { useParams } from 'react-router-dom'
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  ListGroupItem,
} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import StripeCheckout from 'react-stripe-checkout'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Pay from '../components/Pay'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'
import { savePaymentMethod } from '../actions/CartActions'
// require('dotenv').config()

// const KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
// const KEY =
//   'pk_test_51L1dNfF5w4dMwAahRxekeiX0HL5t7M31STT4D6eUlfy32AFDSEdFr8o3qIlj4ISGxsBM35rVW9G2s8zIy2EWdCVb00kuuwBoEv'
// import { Elements } from '@stripe/react-stripe-js'
// import { loadStripe } from '@stripe/stripe-js'
// import CheckoutForm from '../components/CheckoutForm'

// const stripePromise = loadStripe(
//   'pk_test_51L1dNfF5w4dMwAahRxekeiX0HL5t7M31STT4D6eUlfy32AFDSEdFr8o3qIlj4ISGxsBM35rVW9G2s8zIy2EWdCVb00kuuwBoEv'
// )

// console.log(stripePromise)
const OrderScreen = () => {
  // const options = {
  //   clientSecret: process.env.STRIPE_KEY,
  // }
  // console.log(options)
  const dispatch = useDispatch()
  const { id } = useParams()
  const navigate = useNavigate()

  // const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  const orderId = id

  const [sdkReady, setSdkReady] = useState(false)

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails
  // console.log(order)

  const { userInfo } = useSelector((state) => state.userLogin)
  // const { cartItems } = useSelector((state) => state.cart)
  // console.log(order)

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver
  // const [paystackPublicKey, setPaystackPublicKey] = useState('')
  // const [stripeToken, setStripeToken] = useState(null)
  if (!loading) {
    //   Calculate prices
    const addDecimal = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }
    order.itemsPrice = addDecimal(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    if (!order || order._id !== orderId || successPay || successDeliver) {
      if (successPay) return dispatch({ type: ORDER_PAY_RESET })
      if (successDeliver) return dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    }
  }, [order, orderId, dispatch, successPay, successDeliver])

  // Add PayPal Script with the Sdk
  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      // console.log(clientId)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }
    if (!userInfo) navigate('/login')
    if (!sdkReady) addPayPalScript()
  }, [
    dispatch,
    navigate,
    orderId,
    sdkReady,
    userInfo,
    order,
    successPay,
    successDeliver,
  ])

  const successPaymentHandler = (paymentResult) => {
    console(paymentResult)
    dispatch(savePaymentMethod('paypal'))
    dispatch(payOrder(orderId, { paymentResult, paymentMode: 'paypal' }))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {orderId}</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {''}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items: </h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                        <Col md={4}>
                          <Card>
                            <ListGroup variant='flush'>
                              <ListGroup.Item>
                                <h2>Order Summary</h2>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <Row>
                                  <Col>Items</Col>
                                  <Col>${order.itemsPrice}</Col>
                                </Row>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <Row>
                                  <Col>Shipping</Col>
                                  <Col>${order.shippingPrice}</Col>
                                </Row>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <Row>
                                  <Col>Tax</Col>
                                  <Col>${order.taxPrice}</Col>
                                </Row>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <Row>
                                  <Col>Total</Col>
                                  <Col>${order.totalPrice}</Col>
                                </Row>
                              </ListGroup.Item>
                              {/* 
                              {!order.isPaid && (
                                <ListGroup.Item>
                                  {loadingPay && <Loader />}
                                  {!sdkReady ? (
                                    <Loader />
                                  ) : order.paymentMethod === 'PayPal' ? (
                                    <>
                                      <PayPalButton
                                        amount={order.totalPrice}
                                        onSuccess={successPaymentHandler}
                                      />
                                    </>
                                  ) : order.paymentMethod === 'stripe' ? (
                                    <>
                                      <StripeCheckout
                                        name='Shop'
                                        billingAddress
                                        shippingAddress
                                        token={onToken}
                                        onSuccess={successStripeHandler}
                                        stripeKey={KEY}
                                        description={`Your total is $${cartItems.totalPrice}`}
                                        amount={cartItems.totalPrice * 100}
                                      >
                                        <button>CHECKOUT Now</button>
                                      </StripeCheckout>
                                    </>
                                  ) : (
                                    {}
                                  )}
                                </ListGroup.Item>
                              )} */}

                              {!order.isPaid && (
                                <ListGroup.Item>
                                  {loadingPay && <Loader />}
                                  {!sdkReady ? (
                                    <Loader />
                                  ) : order.paymentMethod === 'PayPal' ? (
                                    <>
                                      <PayPalButton
                                        amount={order.totalPrice}
                                        onSuccess={successPaymentHandler}
                                      />
                                    </>
                                  ) : null}
                                </ListGroup.Item>
                              )}

                              {!order.isPaid && (
                                <ListGroup.Item>
                                  {loadingPay && <Loader />}
                                  {!sdkReady ? (
                                    <Loader />
                                  ) : order.paymentMethod === 'Stripe' ? (
                                    <>
                                      <Pay />
                                    </>
                                  ) : null}
                                </ListGroup.Item>
                              )}

                              {loadingDeliver && <Loader />}
                              {userInfo &&
                                userInfo.isAdmin &&
                                order.isPaid &&
                                !order.isDelivered && (
                                  <ListGroup.Item>
                                    <Button
                                      type='button'
                                      className='btn btn-block'
                                      onClick={deliverHandler}
                                    >
                                      Mark As Deliver
                                    </Button>
                                  </ListGroup.Item>
                                )}
                            </ListGroup>
                          </Card>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
