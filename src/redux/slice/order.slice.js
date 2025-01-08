import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../hooks/axiosInstance";

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllOrders = createAsyncThunk(
    "/getAllOrders",
    async (admin_id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(`/order/getAll`,admin_id);
  
        return response.data; // Assuming the API returns an array of users
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );

  export const getAllPayments = createAsyncThunk(
    "/getAllPayments",
    async (admin_id, { rejectWithValue }) => {
      // console.log(admin_id);
      try {
        const response = await axiosInstance.post(`/get-payments`,admin_id);
  
        return response.data.result; // Assuming the API returns an array of users
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );


  export const getLastOrder = createAsyncThunk(
    "/getLastOrder",
    async (admin_id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(`/orders/last`,admin_id);
  
        // console.log(response.data.order.id + 1);
        localStorage.setItem("lastOrder", JSON.stringify(response.data.order.id + 1));
        return response.data.order.id + 1; // Assuming the API returns an array of users
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );

  export const getCredit = createAsyncThunk(
    "/getCredit",
    async (admin_id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(`/order/getCredit`,admin_id);
        return response.data.data;
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );
  

  const orderSlice = createSlice({
    name: "order",
    initialState: {
      orders: [],
      lastOrder: '',
      payments: [],
      credit: [],
      loadingOrder: false,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
      // getAllOrders
        .addCase(getAllOrders.pending, (state) => {
          state.loadingOrder = true;
        })
        .addCase(getAllOrders.fulfilled, (state, action) => {
          state.loadingOrder = false;
          state.orders = action.payload;
        })
        .addCase(getAllOrders.rejected, (state, action) => {
          state.loadingOrder = false;
        })

        // getAllPayments
        .addCase(getAllPayments.pending, (state) => {
          state.loadingOrder = true;
        })
        .addCase(getAllPayments.fulfilled, (state, action) => {
          state.loadingOrder = false;
          state.payments = action.payload;
        })
        .addCase(getAllPayments.rejected, (state, action) => {
          state.loadingOrder = false;
        })

         // getAllPayments
         .addCase(getCredit.pending, (state) => {
          state.loadingOrder = true;
        })
        .addCase(getCredit.fulfilled, (state, action) => {
          state.loadingOrder = false;
          state.credit = action.payload;
        })
        .addCase(getCredit.rejected, (state, action) => {
          state.loadingOrder = false;
        })
        
         // getAllPayments
         .addCase(getLastOrder.pending, (state) => {
          state.loadingOrder = true;
        })
        .addCase(getLastOrder.fulfilled, (state, action) => {
          state.loadingOrder = false;
          state.lastOrder = action.payload;
        })
        .addCase(getLastOrder.rejected, (state, action) => {
          state.loadingOrder = false;
        })
    }
  })

  export default orderSlice.reducer;