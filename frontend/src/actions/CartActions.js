import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/CartConstants'
import Cookie from 'js-cookie'
// import { useNavigate } from 'react-router-dom'

export const addToCart = (id, qty) => async (dispatch, getState) => {
  // const navigate = useNavigate()
  try {
    const { data } = await axios.get(`/api/products/${encodeURIComponent(id)}`)

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty,
      },
    })

    Cookie.set('cartItems', JSON.stringify(getState().cart.cartItems))
    // navigate('/cart')
  } catch (error) {
    console.log(error)
  }
}

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })
  Cookie.set('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })
  Cookie.set('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })
  Cookie.set('paymentMethod', JSON.stringify(data))
}
