import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/CartConstants'

// const initialState = {
//   cartItems = []
// }
export const cartReducer = (state = { cartItems: [] }, action) => {
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
        cartItems: state.cartItems.filter((el) => el.product !== item),
      }

    default:
      return state
  }
}
