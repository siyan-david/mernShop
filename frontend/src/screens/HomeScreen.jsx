import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProducts } from '../actions/productActions.js'
import { Link, useParams } from 'react-router-dom'
import { Paginate } from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

// import axios from 'axios'
// import products from '../products'

const HomeScreen = () => {
  // const [products, setProducts] = useState([])

  const query = useParams()
  const keyword = query.keyword
  const pageNumber = query.pageNumber || 1

  const dispatch = useDispatch()
  const productList = useSelector((state) => state.productList)
  const { loading, error, products, pages, page } = productList

  useEffect(() => {
    /*
    console.log('Hello')
    const fetchProduct = async () => {
      const { data } = await axios.get('/api/products')
      setProducts(data)
 
    }
    fetchProduct()
    */
    // console.log(listProducts(keyword, pageNumber))
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

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
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light'>
          Go Back
        </Link>
      )}
      <h1 style={{ margin: '1rem' }}>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='secondary'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                {/* <h3>{product.name}</h3> */}
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <>
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ''}
            />
          </>
        </>
      )}
    </>
  )
}

export default HomeScreen
