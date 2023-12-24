import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// Move API call logic to a separate function
//loginUser
const loginUserAPI = async (data) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const loginUser = createAsyncThunk(
  "loginUser",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const responseData = await loginUserAPI(data);
      if (responseData.success) {
        toast.success(responseData.message);
        return { user: responseData.user, isAuthenticated: true };
      } else {
        toast.error(responseData.message);
        return { user: {}, isAuthenticated: false };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//RegisterUser
const registerUserAPI = async (data) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const registerUser = createAsyncThunk(
  "registerUser",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const responseData = await registerUserAPI(data);
      if (responseData.success) {
        toast.success(responseData.message);
        return { user: responseData.user, isAuthenticated: true };
      } else {
        toast.error(responseData.message);
        return { user: {}, isAuthenticated: false };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//logoutUser

const logoutUserAPI = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const logoutUser = createAsyncThunk(
  "logoutUser",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const responseData = await logoutUserAPI();
      if (responseData.success) {
        toast.success(responseData.message);
        return { user: {}, isAuthenticated: false };
      } else {
        toast.error(responseData.message);
        return { user: {}, isAuthenticated: false };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//loggedInUser
const loggedInUserAPI = async () => {
  const response = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  });

  return response.json();
};

export const loggedInUser = createAsyncThunk(
  "loggedInUser",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const responseData = await loggedInUserAPI();
      if (responseData.success) {
        return { user: responseData.user, isAuthenticated: true };
      } else {
        return { user: {}, isAuthenticated: false };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = { user: {}, loading: false, isAuthenticated: false ,error:false};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    register: (state, action) => {},
    login: (state, action) => {},
    logout: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(loginUser.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        ...action.payload,
      }))
      .addCase(loginUser.rejected, (state) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
      }))
      .addCase(registerUser.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(registerUser.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        ...action.payload,
      }))
      .addCase(registerUser.rejected, (state) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
      }))
      .addCase(logoutUser.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(logoutUser.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        ...action.payload,
      }))
      .addCase(logoutUser.rejected, (state) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
      }))
      .addCase(loggedInUser.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(loggedInUser.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        ...action.payload,
      }))
      .addCase(loggedInUser.rejected, (state) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
      }));
  },
});

export const { logout, login, register } = userSlice.actions;
export default userSlice.reducer;
