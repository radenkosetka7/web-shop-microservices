import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryService from "../services/category.service";


export const getCategories = createAsyncThunk("categories/getCategories", async ({ rejectWithValue }) => {
  try {
    return await categoryService.getAllCategories();
  } catch (err) {
    return rejectWithValue("There is some problem with getting data. Please try later.");
  }
});

export const getCategory = createAsyncThunk("categories/getCategory", async ({ value }, { rejectWithValue }) => {
  try {
    return await categoryService.getCategory(value);
  } catch (err) {
    return rejectWithValue("There is some problem with getting data. Please try later.");
  }
});

export const crateCategory = createAsyncThunk("categories", async ({ value }, { rejectWithValue }) => {
  try {
    return await categoryService.createCategory(value);
  } catch (err) {
    return rejectWithValue("There is some problem with getting data. Please try later.");
  }
});

export const getCategoryAttributes = createAsyncThunk("categories/attributes", async ({ value }, { rejectWithValue }) => {
  try {
    return await categoryService.getCategoryAttributes(value);
  } catch (err) {
    return rejectWithValue("There is some problem with getting data. Please try later.");
  }
});

export const updateCategory = createAsyncThunk("categories/updateCategory", async ({
                                                                                     id,
                                                                                     value
                                                                                   }, { rejectWithValue }) => {
  try {
    return await categoryService.updateCategory(id, value);
  } catch (err) {
    return rejectWithValue("There is some problem with getting data. Please try later.");
  }
});

export const updateAttrbiute = createAsyncThunk("categories/updateAttribute", async ({
                                                                                       id,
                                                                                       value
                                                                                     }, { rejectWithValue }) => {
  try {
    return await categoryService.updateAttribute(id, value);
  } catch (err) {
    return rejectWithValue("There is some problem with getting data. Please try later.");
  }
});

export const deleteCategory = createAsyncThunk("categories/deleteCategory", async ({ value }, { rejectWithValue }) => {
  try {
    return await categoryService.deleteCategory(value);
  } catch (err) {
    return rejectWithValue("There is some problem with getting data. Please try later.");
  }
});


const removeCat = (state) => {
  state.selectedCategory = null;
};

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    selectedCategory: null,
    attributes: []
  },
  reducers: {
    removeCategory: removeCat
  },
  extraReducers: {
    [getCategories.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.categories = action.payload.data;
    },
    [getCategories.pending]: (state, action) => {
      state.loading = true;
    },
    [getCategories.rejected]: (state, action) => {
      state.loading = false;
    },
    [getCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.selectedCategory = action.payload.data;
    },
    [getCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [getCategory.rejected]: (state, action) => {
      state.loading = false;
    },
    [crateCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [crateCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [crateCategory.rejected]: (state, action) => {
      state.loading = false;
    },
    [getCategoryAttributes.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.attributes = action.payload.data;
    },
    [getCategoryAttributes.pending]: (state, action) => {
      state.loading = true;
    },
    [getCategoryAttributes.rejected]: (state, action) => {
      state.loading = false;
    },
    [updateCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.selectedCategory = action.payload.data;
    },
    [updateCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [updateCategory.rejected]: (state, action) => {
      state.loading = false;
    },
    [updateAttrbiute.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [updateAttrbiute.pending]: (state, action) => {
      state.loading = true;
    },
    [updateAttrbiute.rejected]: (state, action) => {
      state.loading = false;
    },
    [deleteCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [deleteCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteCategory.rejected]: (state, action) => {
      state.loading = false;
    }

  }

});

export const { removeCategory } = categorySlice.actions;

export default categorySlice.reducer;