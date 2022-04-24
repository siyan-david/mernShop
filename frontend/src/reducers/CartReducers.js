import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/CartConstants'

const initialState = {
  cartItems: [],
  shippingAddress: {},
}

export const cartReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case CART_ADD_ITEM:
      const item = payload
      const existItem = state.cartItems.find(
        (el) => el.product === item.product
      )

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((el) =>
            el.productId === existItem.productId ? item : el
          ),
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (el) => el.product !== action.payload
        ),
      }

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: payload,
      }

    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: payload,
      }

    default:
      return state
  }
}
