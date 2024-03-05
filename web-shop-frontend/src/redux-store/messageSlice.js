import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import messageService from "../services/message.service";


export const createMessage= createAsyncThunk("messages/createMessage", async ({value}, {rejectWithValue}) => {
    try {
        return await messageService.createMessage(value);
    } catch (err) {
        return rejectWithValue("Error while adding new message. Please try later.");
    }
});

export const getMessages= createAsyncThunk("messages", async ({page,size}, {rejectWithValue}) => {
    try {
        return await messageService.getMessages(page,size);
    } catch (err) {
        return rejectWithValue("Error while adding new message. Please try later.");
    }
});


export const readMessage= createAsyncThunk("messages/readMessage", async ({value}, {rejectWithValue}) => {
    try {
        return await messageService.readMessage(value);
    } catch (err) {
        return rejectWithValue("Error while adding new message. Please try later.");
    }
});

export const getMessage= createAsyncThunk("messages/getMessage", async ({value}, {rejectWithValue}) => {
    try {
        return await messageService.getMessage(value);
    } catch (err) {
        return rejectWithValue("Error while adding new message. Please try later.");
    }
});

export const replyMessage= createAsyncThunk("messages/getMessage", async ({mail,question,answer}, {rejectWithValue}) => {
    try {
        return await messageService.replyMessage(mail,question,answer);
    } catch (err) {
        return rejectWithValue("Error while adding new message. Please try later.");
    }
});




const messageSlice = createSlice({
    name:'messages',
    initialState: {
        messages:[],
        message: null,
    },
    reducers: {},
    extraReducers: {
        [createMessage.fulfilled]: (state,action) => {
            state.loading=false;
            state.error=null;
        },
        [createMessage.pending]: (state,action) => {
            state.loading=true;
        },
        [createMessage.rejected]: (state,action) => {
            state.loading=false;
        },
        [getMessages.fulfilled]: (state,action) => {
            state.loading=false;
            state.error=null;
            state.messages = action.payload.data;
        },
        [getMessages.pending]: (state,action) => {
            state.loading=true;
        },
        [getMessages.rejected]: (state,action) => {
            state.loading=false;
        },
        [readMessage.fulfilled]: (state,action) => {
            state.loading=false;
            state.error=null;
        },
        [readMessage.pending]: (state,action) => {
            state.loading=true;
        },
        [readMessage.rejected]: (state,action) => {
            state.loading=false;
        },
        [getMessage.fulfilled]: (state,action) => {
            state.loading=false;
            state.error=null;
            state.message = action.payload.data;
        },
        [getMessage.pending]: (state,action) => {
            state.loading=true;
        },
        [getMessage.rejected]: (state,action) => {
            state.loading=false;
        },
        [replyMessage.fulfilled]: (state,action) => {
            state.loading=false;
            state.error=null;
        },
        [replyMessage.pending]: (state,action) => {
            state.loading=true;
        },
        [replyMessage.rejected]: (state,action) => {
            state.loading=false;
        },
    }


})

export default messageSlice.reducer;