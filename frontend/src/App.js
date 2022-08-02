import React from 'react'
//This uses HTML5 history
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import CreateProductScreen from './screens/CreateProductScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'
const App = () => {
  return (
    // fragment
    <>
      <Router>
        <Header />
        <main className='py-10'>
          <Container>
            {/* <h1>Welcome to Shop</h1> */}
            {/* <HomeScreen /> */}
            <Routes>
              <Route path='/orders/:id' element={<OrderScreen />} />
              <Route path='/shipping' element={<ShippingScreen />} />
              <Route path='/payment' element={<PaymentScreen />} />
              <Route path='/placeorder' element={<PlaceOrderScreen />} />
              <Route path='/login' element={<LoginScreen />} />
              <Route path='/register' element={<RegisterScreen />} />
              <Route path='/profile' element={<ProfileScreen />} />
              <Route path='/product/:id' element={<ProductScreen />} />
              <Route path='/cart/:id' element={<CartScreen />} />
              <Route path='/cart' element={<CartScreen />} />
              <Route path='/admin/userlist' element={<UserListScreen />} />
              <Route
                path='/admin/productlist'
                element={<ProductListScreen exact />}
              />
              <Route
                path='/admin/productlist/:pageNumber'
                element={<ProductListScreen exact />}
              />
              <Route path='/admin/orderlist' element={<OrderListScreen />} />
              <Route
                path='/admin/product/:id/edit'
                element={<ProductEditScreen />}
              />
              <Route
                path='/admin/createproduct'
                element={<CreateProductScreen />}
              />
              <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
              <Route path='/' element={<HomeScreen />} />
              <Route path='/search/:keyword' element={<HomeScreen />} exact />
              <Route path='/page/:pageNumber' element={<HomeScreen />} exact />
              <Route
                path='/search/:keyword/page/:pageNumber'
                element={<HomeScreen />}
                exact
              />
              {/* <Route path={['/cart/:id', '/cart']} element={<CartScreen />} /> */}
            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  )
}

export default App
