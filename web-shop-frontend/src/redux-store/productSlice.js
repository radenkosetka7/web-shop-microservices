import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import productService, {uploadImages} from "../services/product.service";



export const getAllProducts = createAsyncThunk("products/getAllProducts", async ({page,size,title},{rejectWithValue}) => {
    try {
        return await productService.getAllProducts(page,size,title);
    } catch (err) {
        return rejectWithValue("There is some problem with getting data. Please try later.");
    }
});

export const getProduct = createAsyncThunk("products/getProduct", async ({value},{rejectWithValue}) => {
    try {
        return await productService.getProductByid(value);
    } catch (err) {
        return rejectWithValue("There is some problem with getting data. Please try later.");
    }
});

export const createProduct = createAsyncThunk("products/createProduct", async ({value}, {rejectWithValue}) => {
    try {
        return await productService.addProduct(value);
    } catch (err) {
        return rejectWithValue("Error while adding new model. Please try later.");
    }
});

export const searchProduct = createAsyncThunk("products/searchProduct", async ({page,size,value},{rejectWithValue}) => {
    try {
        return await productService.searchProduct(page,size,value);
    } catch (err) {
        return rejectWithValue("There is some problem with getting data. Please try later.");
    }
});


export const deleteProduct = createAsyncThunk("products/deleteProduct", async ({id}, {rejectWithValue}) => {
    try {
        return await productService.deleteProduct(id);
    } catch (err) {
        return rejectWithValue("Error while deleting model. Please try later.");
    }
});

export const purchaseProduct = createAsyncThunk("products/purchaseProduct", async ({id}, {rejectWithValue}) => {
    try {
        return await productService.purchaseProduct(id);
    } catch (err) {
        return rejectWithValue("Error while updating model. Please try later.");
    }
});

export const getAllProductsForBuyer = createAsyncThunk("products/getAllProductsForBuyer", async ({page,size},{rejectWithValue}) => {
    try {
        return await productService.getAllProductsForBuyer(page,size);
    } catch (err) {
        return rejectWithValue("There is some problem with getting data. Please try later.");
    }
});

export const getAllProductsForSeller = createAsyncThunk("products/getAllProductsForBuyer", async ({page,size,finished},{rejectWithValue}) => {
    try {
        return await productService.getAllProductsForSeller(page,size,finished);
    } catch (err) {
        return rejectWithValue("There is some problem with getting data. Please try later.");
    }
});

export const uploadProductImages = createAsyncThunk("products/uploadImages", async ({value}, {rejectWithValue}) => {
    try {
        return await productService.uploadImages(value);
    } catch (err) {
        return rejectWithValue("Error while adding new model. Please try later.");
    }
});


const removeProductFunction = (state) => {
    state.selectedProduct = null;
}



const productSlice = createSlice({
    name:'products',
    initialState:{
        products:[],
        selectedProduct:null
    },
    reducers:{
        removeProduct:removeProductFunction
    },
    extraReducers: {
        [getAllProducts.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
            state.products = action.payload.data;
        },
        [getAllProducts.pending]: (state, action) => {
            state.loading = true;
        },
        [getAllProducts.rejected]: (state, action) => {
            state.loading = false;
        },
        [getProduct.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
            state.selectedProduct = action.payload.data;
        },
        [getProduct.pending]: (state, action) => {
            state.loading = true;
        },
        [getProduct.rejected]: (state, action) => {
            state.loading = false;
        },
        [createProduct.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
        },
        [createProduct.pending]: (state, action) => {
            state.loading = true;
        },
        [createProduct.rejected]: (state, action) => {
            state.loading = false;
        },
        [searchProduct.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
            state.products = action.payload.data;
        },
        [searchProduct.pending]: (state, action) => {
            state.loading = true;
        },
        [searchProduct.rejected]: (state, action) => {
            state.loading = false;
        },
        [deleteProduct.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
        },
        [deleteProduct.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteProduct.rejected]: (state, action) => {
            state.loading = false;
        },
        [purchaseProduct.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
        },
        [purchaseProduct.pending]: (state, action) => {
            state.loading = true;
        },
        [purchaseProduct.rejected]: (state, action) => {
            state.loading = false;
        },
        [getAllProductsForSeller.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
            state.products = action.payload.data;
        },
        [getAllProductsForSeller.pending]: (state, action) => {
            state.loading = true;
        },
        [getAllProductsForSeller.rejected]: (state, action) => {
            state.loading = false;
        },
        [getAllProductsForBuyer.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
            state.products = action.payload.data;
        },
        [getAllProductsForBuyer.pending]: (state, action) => {
            state.loading = true;
        },
        [getAllProductsForBuyer.rejected]: (state, action) => {
            state.loading = false;
        },
        [uploadImages.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
        },
        [uploadImages.pending]: (state, action) => {
            state.loading = true;
        },
        [uploadImages.rejected]: (state, action) => {
            state.loading = false;
        },
    }

})

export const {removeProduct} = productSlice.actions;

export default productSlice.reducer;