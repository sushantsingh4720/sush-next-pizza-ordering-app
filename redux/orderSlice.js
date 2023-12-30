import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//create order product
const createOrderAPI = async (data) => {
  const response = await fetch("/api/orders/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const createOrder = createAsyncThunk(
  "createOrder",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const responseData = await createOrderAPI(data);
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

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: [],
    error: false,
    success: false,
  },
  reducers: {
    resetAddOrder: (state) => {
      return {
        ...state,
        success: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createOrder.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(createOrder.fulfilled, (state) => {
        return {
          ...state,
          loading: false,
          success: true,
        };
      })
      .addCase(createOrder.rejected, (state) => {
        return {
          ...state,
          loading: false,
          success: false,
        };
      });
  },
});

export const { resetAddOrder } = orderSlice.actions;
export default orderSlice.reducer;
