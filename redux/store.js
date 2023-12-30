import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
export default configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    product: productReducer,
    order: orderReducer,
  },
});
