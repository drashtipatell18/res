import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../hooks/axiosInstance";

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllitems = createAsyncThunk(
  "/getAllitems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/item/getAll`);

      return response.data.items; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getAllDeleteditems = createAsyncThunk(
  "/getAllDeleteditems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/item/getAllDeletedAt`);

      return response.data.items;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSubFamily = createAsyncThunk(
  "/getSubFamily",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/subfamily/getSubFamily`);

      return response.data; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getFamily = createAsyncThunk(
  "/getFamily",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/family/getFamily`);

      return response.data; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getProduction = createAsyncThunk(
  "/getProduction",
  async (admin_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/production-centers`,
        admin_id
      );

      return response.data.data; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getProductionData = createAsyncThunk(
  "/getProductionData",
  async (admin_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/item/getProducationdata`,
        admin_id
      );

      return response.data.menus; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getMenu = createAsyncThunk(
  "/getMenu",
  async (admin_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/menu/get`, admin_id);

      return response.data.menus; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSaleReport = createAsyncThunk(
  "/getSaleReport",
  async ({ admin_id, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/item/getSaleReport/${id}`, {
        admin_id,
      });

      return response.data; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    deletedAllItems: [],
    subFamily: [],
    family: [],
    production: [],
    productionData: [],
    menu: [],
    saleReport: [],
    loadingItem: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllitems
      .addCase(getAllitems.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(getAllitems.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.items = action.payload;
      })
      .addCase(getAllitems.rejected, (state, action) => {
        state.loadingItem = false;
      })

      // getAllDeleteditems
      .addCase(getAllDeleteditems.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(getAllDeleteditems.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.deletedAllItems = action.payload;
      })
      .addCase(getAllDeleteditems.rejected, (state, action) => {
        state.loadingItem = false;
      })

      // getAllsubcategory
      .addCase(getSubFamily.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(getSubFamily.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.subFamily = action.payload;
      })
      .addCase(getSubFamily.rejected, (state, action) => {
        state.loadingItem = false;
      })

      // getAllsubcategory
      .addCase(getFamily.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(getFamily.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.family = action.payload;
      })
      .addCase(getFamily.rejected, (state, action) => {
        state.loadingItem = false;
      })

      // getProduction
      .addCase(getProduction.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(getProduction.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.production = action.payload;
      })
      .addCase(getProduction.rejected, (state, action) => {
        state.loadingItem = false;
      })

      // getProductionData
      .addCase(getProductionData.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(getProductionData.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.productionData = action.payload;
      })
      .addCase(getProductionData.rejected, (state, action) => {
        state.loadingItem = false;
      })

      // getProductionData
      .addCase(getMenu.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(getMenu.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.menu = action.payload;
      })
      .addCase(getMenu.rejected, (state, action) => {
        state.loadingItem = false;
      })

      // getSaleData
      .addCase(getSaleReport.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(getSaleReport.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.saleReport = action.payload;
      })
      .addCase(getSaleReport.rejected, (state, action) => {
        state.loadingItem = false;
      });
  },
});

export default itemsSlice.reducer;
