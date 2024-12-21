import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../hooks/axiosInstance";

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getUser = createAsyncThunk(
    "/getUser",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/get-users`);
  
        return response.data; // Assuming the API returns an array of users
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );


  export const getRols = createAsyncThunk(
    "/getRols",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/roles`);    
        return response.data; // Assuming the API returns an array of users
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );

  export const getSingleUser = createAsyncThunk(
    "/getSingleUser",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/get-user/${id}`);
  
        return response.data[0]; // Assuming the API returns an array of users
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );


  const userSlice = createSlice({
    name: "user",
    initialState: {
      user: [],
      roles:[],
      singleUser: [],
      loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
      // getAllusers
        .addCase(getUser.pending, (state) => {
          state.loading = true;
        })
        .addCase(getUser.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(getUser.rejected, (state, action) => {
          state.loading = false;
        })

        // getAllRols
        .addCase(getRols.pending, (state) => {
            state.loading = true;
          })
          .addCase(getRols.fulfilled, (state, action) => {
            state.loading = false;
            state.roles = action.payload;
          })
          .addCase(getRols.rejected, (state, action) => {
            state.loading = false;
          })

          // getSingleuser
        .addCase(getSingleUser.pending, (state) => {
            state.loading = true;
          })
          .addCase(getSingleUser.fulfilled, (state, action) => {
            state.loading = false;
            state.singleUser = action.payload;
          })
          .addCase(getSingleUser.rejected, (state, action) => {
            state.loading = false;
          })
    }
  })

  export default userSlice.reducer;
