import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import Cookie from 'js-cookie'
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productTopRatedReducer,
  productCreateReviewReducer,
  productUpdateReducer,
} from './reducers/productReducers'
import { cartReducer } from './reducers/CartReducers'
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducers,
} from './reducers/userReducers'
import {
  orderCreateReducers,
  orderDetailsReducers,
  orderPayReducers,
  orderListMyReducers,
  orderListReducers,
  orderDeliveryReducer,
} from './reducers/orderReducers'

export const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productReview: productCreateReviewReducer,
  productUpdate: productUpdateReducer,
  productTopRated: productTopRatedReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducers,
  orderCreate: orderCreateReducers,
  orderDetails: orderDetailsReducers,
  orderPay: orderPayReducers,
  orderDeliver: orderDeliveryReducer,
  orderListMy: orderListMyReducers,
  orderList: orderListReducers,
})

const cartItemsFromCookie = Cookie.get('cartItems')
  ? JSON.parse(Cookie.get('cartItems'))
  : []

const userInfoFromCookie = Cookie.get('userInfo')
  ? JSON.parse(Cookie.get('userInfo'))
  : null

const shippingAddressFromCookie = Cookie.get('shippingAddress')
  ? JSON.parse(Cookie.get('shippingAddress'))
  : {}

const initialState = {
  cart: {
    cartItems: cartItemsFromCookie,
    shippingAddress: shippingAddressFromCookie,
  },
  userLogin: { userInfo: userInfoFromCookie },
}
const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
