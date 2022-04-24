import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
// import { saveShippingAddress } from '../actions/CartActions'

const CreateProductScreen = () => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    price: 0,
    brand: '',
    description: '',
    category: '',
    countInStock: 0,
  })

  const [image, setImage] = useState(null)

  const { name, price, brand, description, category, countInStock } =
    productDetails

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = useSelector((state) => state.productCreate)

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET })
      return navigate('/admin/productlist')
    }
  }, [dispatch, navigate, successCreate])

  const onImageClick = (e) => {
    e.preventDefault()
    setImage(e.target.files[0])
    // console.log(e.target.files[0])
  }

  const submitHandler = (e) => {
    e.preventDefault()
    // console.log('submit')
    // CREATE PRODUCT'

    // const newFormData = new FormData({ ...productDetails, image })

    dispatch(createProduct({ ...productDetails, image }))
  }

  return (
    <>
      <FormContainer>
        <h1>Create Product</h1>
        {loadingCreate && <Loader />}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              name='name'
              type='text'
              placeholder='Enter name'
              value={name}
              required
              onChange={(e) =>
                setProductDetails({
                  ...productDetails,
                  [e.target.name]: e.target.value,
                })
              }
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              name='price'
              type='text'
              placeholder='Enter price'
              value={price}
              required
              onChange={(e) =>
                setProductDetails({
                  ...productDetails,
                  [e.target.name]: e.target.value,
                })
              }
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='brand'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              name='brand'
              type='text'
              placeholder='Enter brand'
              value={brand}
              required
              onChange={(e) =>
                setProductDetails({
                  ...productDetails,
                  [e.target.name]: e.target.value,
                })
              }
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              name='description'
              type='text'
              placeholder='Enter description'
              value={description}
              required
              onChange={(e) =>
                setProductDetails({
                  ...productDetails,
                  [e.target.name]: e.target.value,
                })
              }
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              name='category'
              type='text'
              placeholder='Enter category'
              value={category}
              required
              onChange={(e) =>
                setProductDetails({
                  ...productDetails,
                  [e.target.name]: e.target.value,
                })
              }
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='countInStock'>
            <Form.Label>In Stock</Form.Label>
            <Form.Control
              name='countInStock'
              type='text'
              placeholder='Enter countInStock'
              value={countInStock}
              required
              onChange={(e) =>
                setProductDetails({
                  ...productDetails,
                  [e.target.name]: e.target.value,
                })
              }
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='fileImage' className='mb-3'>
            <Form.Label className='py-2'>Select Image</Form.Label>
            <Form.Control
              name='image'
              id='image-file'
              className='img'
              type='file'
              size='sm'
              // custom
              onChange={onImageClick}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default CreateProductScreen
