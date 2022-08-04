import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../components/Rating'
import Meta from '../components/Meta'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
// import { ListGroupItem } from 'react-bootstrap'

// import axios from 'axios'

const ProductScreen = () => {
  const [qty, setQtY] = useState(1)
  // const [rating, setRating] = useState(0)
  // const [comment, setComment] = useState('')
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const {
    loading: loadingReview,
    success: successReview,
    error: errorReview,
  } = useSelector((state) => state.productReview)

  const { userInfo } = useSelector((state) => state.userLogin)

  // console.log(userInfo.id.toString())
  // const [product, setProduct] = useState({})
  // const alreadyReviewed = product.reviews.find(
  //   (r) => r.user.toString() === userInfo.user.id.toString()
  // )

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === userInfo.id.toString()
  )
  // console.log(alreadyReviewed)

  /*
  useEffect(() => {
    // fetch single product with the unique ID
    
    const fetchProduct = async () => {
      const { data } = await axios.get(
        `/api/products/${encodeURIComponent(id)}`
      )
      setProduct(data)

      console.log(data)

    }
  }, [id])
*/
  useEffect(() => {
    if (successReview) {
      alert('Review Submitted')
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(listProductDetails(id))
  }, [dispatch, id, successReview])

  // must have id + qty
  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`)
  }

  // const submitHandler = (e) => {
  //   e.preventDefault()
  //   if (!rating || !comment) {
  //     throw new Error('Please enter rating and comment')
  //   } else {
  //     return dispatch(createProductReview(id, { rating, comment }))
  //   }
  // }

  const submitHandler = () => {
    dispatch(
      createProductReview(id, {
        rating,
        comment,
      })
    )
  }

  if (loadingReview) return <Loader />
  // console.log(...Array(product.countInStock).keys())
  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta
            title={product.name}
            description={product.description}
            keywords={`affordable ${product.category}, best ${product.category} product`}
          />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>Desc: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQtY(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-black'
                      type='button'
                      disabled={!product.countInStock || qty === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {!product.reviews.length && <Message> No Reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  {!userInfo ? (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Message>
                  ) : (
                    !alreadyReviewed && (
                      <>
                        <h2>Write a customer review</h2>
                        {errorReview && (
                          <Message variant='danger'>{errorReview}</Message>
                        )}
                        <Form onSubmit={submitHandler}>
                          <Form.Group controlId='rating'>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                              type='number'
                              value={rating}
                              step={0.5}
                              max={5}
                              min={0}
                              name='rating'
                              placeholder='Enter a rating between 0 and 5'
                              onChange={(e) => setRating(e.target.value)}
                            />
                          </Form.Group>

                          <Form.Group controlId='comment'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as='textarea'
                              row={3}
                              value={comment}
                              name='comment'
                              placeholder='Enter a comment'
                              onChange={(e) => setComment(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                          <Button type='submit' variant='primary'>
                            Submit
                          </Button>
                        </Form>
                      </>
                    )
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
