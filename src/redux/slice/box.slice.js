import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../hooks/axiosInstance";

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getboxs = createAsyncThunk(
    "/getboxs",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/get-boxs`);
  
        return response.data; // Assuming the API returns an array of users
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );

  export const getboxsLogs = createAsyncThunk(
    "/getboxsLogs",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/get-all-boxs-log`);
  
        return response.data; // Assuming the API returns an array of users
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );


  const boxSlice = createSlice({
    name: "box",
    initialState: {
      box: [],
      boxLogs : [],
      loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
      // getAllitems
        .addCase(getboxs.pending, (state) => {
          state.loading = true;
        })
        .addCase(getboxs.fulfilled, (state, action) => {
          state.loading = false;
          state.box = action.payload;
        })
        .addCase(getboxs.rejected, (state, action) => {
          state.loading = false;
        })

        // getboxsLogs
        .addCase(getboxsLogs.pending, (state) => {
            state.loading = true;
          })
          .addCase(getboxsLogs.fulfilled, (state, action) => {
            state.loading = false;
            state.boxLogs = action.payload;
          })
          .addCase(getboxsLogs.rejected, (state, action) => {
            state.loading = false;
          })
    }
  })

  export default boxSlice.reducer;
