import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../hooks/axiosInstance";

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllKds = createAsyncThunk(
    "/getAllKds",
    async (admin_id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(`/order/getAllKds?received=yes&prepared=yes&delivered=yes&finalized=yes`,admin_id);
  
        return response.data; // Assuming the API returns an array of users
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );
  
  const kdsSlice = createSlice({
    name: "kds",
    initialState: {
      kds: [],
      // kdsLogs : [],
      loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
      // getAllitems
        .addCase(getAllKds.pending, (state) => {
          state.loading = true;
        })
        .addCase(getAllKds.fulfilled, (state, action) => {
          state.loading = false;
          state.kds = action.payload;
        })
        .addCase(getAllKds.rejected, (state, action) => {
          state.loading = false;
        })
    }
  })

  export default kdsSlice.reducer;
