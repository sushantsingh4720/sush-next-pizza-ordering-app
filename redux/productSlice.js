import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//getAllProduct
const getAllProductAPI = async () => {
  const response = await fetch("/api/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const getAllProduct = createAsyncThunk(
  "getAllProduct",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const responseData = await getAllProductAPI();
      if (responseData.success) {
        return { product: responseData.product };
      } else {
        return { product: [] };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//add new product
const addProductAPI = async (data) => {
  const response = await fetch("/api/products/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const addProduct = createAsyncThunk(
  "addProduct",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const responseData = await addProductAPI(data);
      if (responseData.success) {
        toast.message(responseData.message);
      } else {
        toast.message(responseData.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = { product: [], success: false, loading: false };

const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllProduct.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getAllProduct.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        ...action.payload,
      }))
      .addCase(getAllProduct.rejected, (state) => ({
        ...state,
        loading: false,
      }));
  },
});

export default productSlice.reducer;