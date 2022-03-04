import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProducts } from '../actions/productActions.js'

// import axios from 'axios'
// import products from '../products'

const HomeScreen = () => {
  // const [products, setProducts] = useState([])

  const dispatch = useDispatch()
  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    /*
    console.log('Hello')
    const fetchProduct = async () => {
      const { data } = await axios.get('/api/products')
      setProducts(data)
    }
    fetchProduct()
    */
    dispatch(listProducts())
  }, [dispatch])

  return (
    // <>
    //   <h1 style={{ margin: '1rem' }}>Latest Products</h1>
    //   <Row>
    //     {products.map((product) => (
    //       <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
    //         {/* <h3>{product.name}</h3> */}
    //         <Product product={product} />
    //       </Col>
    //     ))}
    //   </Row>
    // </>

    <>
      <h1 style={{ margin: '1rem' }}>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message varient='secondary'>{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              {/* <h3>{product.name}</h3> */}
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default HomeScreen
