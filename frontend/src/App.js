import React from 'react'
//This uses HTML5 history
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'

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
              <Route path='/' element={<HomeScreen />} />
              <Route path='product/:id' element={<ProductScreen />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  )
}

export default App
