import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../hooks/axiosInstance";

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllTableswithSector = createAsyncThunk(
  "/getAllTables",
  async (admin_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/sector/getWithTable`,
        admin_id
      );
      
      return response.data.data; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getAllSector = createAsyncThunk(
  "/getAllSector",
  async (admin_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/sector/getAll`, admin_id);
      console.log(response.data);
      return response.data.sectors; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getTableState = createAsyncThunk(
  "/getTableState",
  async ({ admin_id, tid }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/table/getStats/${tid}`,
        admin_id
      );

      return response.data; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSingleTable = createAsyncThunk(
  "/getSingleTable",
  async ({ admin_id, tid }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/single-table/${tid}`,
        admin_id
      );
      return response.data; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

const tableSlice = createSlice({
  name: "table",
  initialState: {
    tablewithSector: [],
    sector: [],
    tableState: [],
    singleTable: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllitems
      .addCase(getAllTableswithSector.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTableswithSector.fulfilled, (state, action) => {
        state.loading = false;
        state.tablewithSector = action.payload;
      })
      .addCase(getAllTableswithSector.rejected, (state, action) => {
        state.loading = false;
      })

      // getAllSector
      .addCase(getAllSector.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSector.fulfilled, (state, action) => {
        state.loading = false;
        state.sector = action.payload;
      })
      .addCase(getAllSector.rejected, (state, action) => {
        state.loading = false;
      })

      // getTableState
      .addCase(getTableState.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTableState.fulfilled, (state, action) => {
        state.loading = false;
        state.tableState = action.payload;
      })
      .addCase(getTableState.rejected, (state, action) => {
        state.loading = false;
      })

      // getsingleTable
      .addCase(getSingleTable.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleTable.fulfilled, (state, action) => {
        state.loading = false;
        state.singleTable = action.payload;
      })
      .addCase(getSingleTable.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default tableSlice.reducer;