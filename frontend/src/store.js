import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productDetailsReducer,
  productListReducer,
} from "./reducers/productReducers.js";
import { cartReducer } from "./reducers/cartReducers.js";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
} from "./reducers/userReducers.js";
import {
  createOrderReducer,
  myOrdersListReducer,
  orderDetailsReducer,
  orderPayReducer,
} from "./reducers/orderReducers.js";

const reducers = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  createOrder: createOrderReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  myOrdersList: myOrdersListReducer,
});

const cartItemsFromSTorage =
  JSON.parse(localStorage.getItem("cartItems")) || [];

const userInfoFromStorage =
  JSON.parse(localStorage.getItem("userInfo")) || null;

const shippingAddressFronStorage =
  JSON.parse(localStorage.getItem("shippingAddress")) || {};

const initialState = {
  cart: {
    cartItems: cartItemsFromSTorage,
    shippingAddress: shippingAddressFronStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};
const middleware = [thunk];

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
export default store;