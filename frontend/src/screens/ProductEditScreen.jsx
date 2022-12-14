import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_RESET,
} from '../constants/productConstants'

const ProductEditScreen = () => {
  const { id } = useParams()
  const productId = id
  const [productData, setProductData] = useState({
    name: '',
    price: 0,
    brand: '',
    description: '',
    category: '',
    countInStock: 0,
  })
  // const [image, setImage] = useState('')
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { name, price, brand, description, category, countInStock } =
    productData

  const { userInfo } = useSelector((state) => state.userLogin)
  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  )
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = useSelector((state) => state.productUpdate)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const handleChange = (e) => {
  //   setImage(e.target.value)
  // }
  useEffect(() => {
    if (product) {
      if (product._id === productId) {
        setProductData({
          ...productData,
          name: product.name,
          price: product.price,
          brand: product.brand,
          description: product.description,
          category: product.category,
          countInStock: product.countInStock,
        })
        setImage(product.image)
      } else {
        dispatch(listProductDetails(productId))
      }
    } else {
      dispatch(listProductDetails(productId))
    }
  }, [dispatch, product, setProductData, setImage])

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate('/admin/productlist')
    }
  }, [dispatch, navigate, successUpdate])

  const uploadFileHandler = async (e) => {
    /*
    const file = e.target.files[0]
    console.log(file)
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      setUploading(false)
    }
    */
    e.preventDefault()
    const file = e.target.files[0]
    // console.log(file)
    const formData = new FormData()
    formData.append('image', file)
    // setImage(e.target.files[0])
    setUploading(true)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      setUploading(false)
    }
  }
  const submitHandler = (e) => {
    e.preventDefault()
    // UPDATE PRODUCT
    dispatch(
      updateProduct({
        _id: productId,
        ...productData,
        image,
      })
    )
  }
  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
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
                  setProductData({
                    ...productData,
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
                  setProductData({
                    ...productData,
                    [e.target.name]: e.target.value,
                  })
                }
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                name='image'
                type='text'
                placeholder='Enter image url'
                value={image}
                required
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    [e.target.name]: e.target.value,
                  })
                }
              ></Form.Control>
              <Form.Control
                type='file'
                id='image-file'
                label='Choose File'
                custom='true'
                onChange={uploadFileHandler}
              ></Form.Control>
              {uploading && <Loader />}
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
                  setProductData({
                    ...productData,
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
                  setProductData({
                    ...productData,
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
                  setProductData({
                    ...productData,
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
                  setProductData({
                    ...productData,
                    [e.target.name]: e.target.value,
                  })
                }
              ></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}
export default ProductEditScreen
