import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Row, Col, ListGroup, Button } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart } from '../actions/CartActions'
import CartItems from '../components/CartItems'

const CartScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const productId = id
  // console.log(productId)
  const location = useLocation()

  //?qty=1
  const qty = location.search ? Number(location.search.split('=')[1]) : 1
  // const shipping = location.search ? location.search.split('=')[1] : 'shipping'
  // console.log(qty)

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart
  // console.log(cartItems)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const dispatch = useDispatch()

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
      // navigate('/cart')
    }
  }, [dispatch, productId, qty])

  const checkOutHandler = (e) => {
    console.log('checkout')
    e.preventDefault()
    if (!userInfo) return navigate('/login')
    navigate('/shipping')

    // navigate(`/login?redirect=shipping`)

    // history.push('login?redirect=shipping')
  }

  return (
    <>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((el) => (
                <CartItems key={el.product} item={el} />
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>
                  Subtotal (
                  {cartItems.reduce((prev, next) => prev + next.qty, 0)}) items
                </h2>
                $
                {cartItems
                  .reduce((prev, next) => prev + next.qty * next.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type='button'
                  className='w-100'
                  disabled={cartItems.length === 0}
                  onClick={checkOutHandler}
                >
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CartScreen
