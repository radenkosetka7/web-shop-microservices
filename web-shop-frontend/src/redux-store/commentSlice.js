import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import commentService from "../services/comment.service";


export const createComment= createAsyncThunk("comments/createComment", async ({id,value}, {rejectWithValue}) => {
    try {
        return await commentService.commentProduct(id,value);
    } catch (err) {
        return rejectWithValue("Error while adding new message. Please try later.");
    }
});


export const answerComment= createAsyncThunk("comments/answerComment", async ({id,value}, {rejectWithValue}) => {
    try {
        return await commentService.answerComment(id,value);
    } catch (err) {
        return rejectWithValue("Error while adding new message. Please try later.");
    }
});

const commentSlice = createSlice({
    name:'comments',
    initialState: {
    },
    reducers: {},
    extraReducers: {
        [createComment.fulfilled]: (state,action) => {
            state.loading=false;
            state.error=null;
        },
        [createComment.pending]: (state,action) => {
            state.loading=true;
        },
        [createComment.rejected]: (state,action) => {
            state.loading=false;
        },
        [answerComment.fulfilled]: (state,action) => {
            state.loading=false;
            state.error=null;
        },
        [answerComment.pending]: (state,action) => {
            state.loading=true;
        },
        [answerComment.rejected]: (state,action) => {
            state.loading=false;
        },
    }
})


export default commentSlice.reducer;