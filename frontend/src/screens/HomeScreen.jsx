import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import axios from 'axios'
// import products from '../products'

const HomeScreen = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    // console.log('Hello')
    const fetchProduct = async () => {
      const { data } = await axios.get('/api/products')
      setProducts(data)
    }
    fetchProduct()
  }, [])

  return (
    <>
      <h1 style={{ margin: '1rem' }}>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            {/* <h3>{product.name}</h3> */}
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default HomeScreen
