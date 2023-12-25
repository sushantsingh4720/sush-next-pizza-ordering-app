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

//add new product in cart
const addProductInCartAPI = async (data) => {
  const response = await fetch("/api/cart/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const addProductInCart = createAsyncThunk(
  "addProductInCart",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const responseData = await addProductInCartAPI(data);
      if (responseData.success) {
        toast.success(responseData.message);
        return { success: true };
      } else {
        toast.error(responseData.message);
        return { success: false };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//add new product in cart
const removeProductInCartAPI = async (data) => {
  const {id}=data
  const response = await fetch(`/api/cart/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const removeProductInCart = createAsyncThunk(
  "removeProductInCart",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const responseData = await removeProductInCartAPI(data);
      if (responseData.success) {
        toast.success(responseData.message);
        return { success: true };
      } else {
        toast.error(responseData.message);
        return { success: false };
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
      }))
      .addCase(addProductInCart.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(addProductInCart.fulfilled, (state) => {
        return {
          ...state,
          loading: false,
          success: true,
        };
      })
      .addCase(addProductInCart.rejected, (state) => {
        return {
          ...state,
          loading: false,
          success: false,
        };
      })
      .addCase(removeProductInCart.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(removeProductInCart.fulfilled, (state) => {
        return {
          ...state,
          loading: false,
          success: true,
        };
      })
      .addCase(removeProductInCart.rejected, (state) => {
        return {
          ...state,
          loading: false,
          success: false,
        };
      });
  },
});

export const { resetAddCart } = cartSlice.actions;
export default cartSlice.reducer;
