import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
export default configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
      product:productReducer
    },
  });
