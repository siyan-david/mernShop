import { ListGroup, Image, Form, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { addToCart, removeFromCart } from '../actions/CartActions'
import { useDispatch } from 'react-redux'
const CartItems = ({ item }) => {
  const dispatch = useDispatch()
  const removeFromCartHandler = (id) => {
    console.log('remove')
    dispatch(removeFromCart(id))
  }
  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col md={2}>
            <Image src={item.image} alt={item.name} fluid rounded />
          </Col>
          <Col md={3}>
            <Link to={`/product/${item.product}`}>{item.name}</Link>
          </Col>
          <Col md={2}>${item.price}</Col>
          <Col md={2}>
            <Form.Control
              as='select'
              value={item.qty}
              onChange={(e) =>
                dispatch(addToCart(item.product, Number(e.target.value)))
              }
            >
              {[...Array(item.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col md={2}>
            <Button
              type='button'
              variant='light'
              onClick={() => removeFromCartHandler(item.product)}
            >
              <i className='fas fa-trash'></i>
            </Button>
          </Col>
        </Row>
      </ListGroup.Item>
    </>
  )
}

export default CartItems
