import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//getAllCart
const getAllCartAPI = async () => {
  const response = await fetch("/api/cart", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const getAllCart = createAsyncThunk(
  "getAllCart",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const responseData = await getAllCartAPI();
      if (responseData.success) {
        return { cart: responseData.cart };
      } else {
        return { cart: [] };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    resetAddCart: (state) => {
      return {
        ...state,
        success: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCart.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getAllCart.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        ...action.payload,
      }))
      .addCase(getAllCart.rejected, (state) => ({
        ...state,
        loading: false,
      }));
  },
});

export const { resetAddCart } = cartSlice.actions;
export default cartSlice.reducer;
