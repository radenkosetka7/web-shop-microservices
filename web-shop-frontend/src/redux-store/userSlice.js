import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import userService from "../services/user.service";


export const login = createAsyncThunk("users/login", async ({username, password}) => {
    return await authService.login(username, password);
});

export const updateUser = createAsyncThunk("users/updateUser", async ({
                                                                                            id,
                                                                                            value
                                                                                        }, {rejectWithValue}) => {
    try {
        return await userService.updateUser(id, value);
    } catch (err) {
        return rejectWithValue("Error while updating model. Please try later.");
    }
});
export const getUser = createAsyncThunk("users/getUser", async ({id}) => {
    return await userService.getUser(id);
});

export const changePassword = createAsyncThunk("users/changePassword", async ({
                                                                          value
                                                                      }, {rejectWithValue}) => {
    try {
        return await userService.changePassword(value);
    } catch (err) {
        return rejectWithValue("Error while updating model. Please try later.");
    }
});

export const getAllUsers = createAsyncThunk("user/getAllUsers", async ({page,size,name},{rejectWithValue}) => {
    try {
        return await userService.getUsers(page,size,name);
    } catch (err) {
        return rejectWithValue("There is some problem with getting data. Please try later.");
    }
});

export const getLoggedUser = createAsyncThunk("users/userInfo", async () => {
    return userService.getUserInfo();
});


export const adminRegister = createAsyncThunk("users/adminRegister", async ({value}, {rejectWithValue}) => {
    try {
        return await userService.adminRegister(value);
    } catch (err) {
        return rejectWithValue("Error while adding new model. Please try later.");
    }
});

export const adminUpdateUser = createAsyncThunk("users/adminUpdate", async ({id,value}, {rejectWithValue}) => {
    try {
        return await userService.adminUpdateUser(id,value);
    } catch (err) {
        return rejectWithValue("Error while adding new model. Please try later.");
    }
});

export const blockUser = createAsyncThunk("users/blockUser", async ({id}) => {
    return await userService.blockUser(id);
});
const logoutAction = (state) => {
    state.authenticated = false;
    state.loading = false;
    state.loggedUser = null;
    authService.logout();
}

const userSlice = createSlice({
    name:'users',
    initialState: {
        users: [],
        loggedUser:null,
        user: null,
        authenticated:false,
        authenticatedFailed:false
    },
    reducers: {
        logout: logoutAction
    },
    extraReducers: {
        [login.fulfilled]: (state,action) =>
        {
            state.loading=false;
            state.error=null;
        },
        [login.pending]: (state) => {
            state.loading = true;
        },
        [login.rejected]: (state) => {
            state.authenticatedFailed = true;
            state.loading = false;
        },
        [getUser.fulfilled]: (state,action) => {
            state.loading=false;
            state.error=null;
            state.authenticated=true;
            state.user=action.payload.data;
        },
        [getUser.pending]: (state,action) => {
            state.loading = true;
        },
        [getUser.rejected]: (state,action) => {
            state.loading = false;
        },
        [getLoggedUser.fulfilled]: (state,action) => {
            state.loading=false;
            state.error=null;
            state.authenticated=true;
            state.loggedUser=action.payload.data;
        },
        [getLoggedUser.pending]: (state,action) => {
            state.loading = true;
        },
        [getLoggedUser.rejected]: (state,action) => {
            state.loading = false;
        },
        [updateUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.authenticated = true;
            state.error=null;
            state.user = action.payload.data;
        },
        [updateUser.pending]: (state, action) => {
            state.loading = true;
        },
        [updateUser.rejected]: (state, action) => {
            state.loading = false;
        },
        [changePassword.fulfilled]: (state, action) => {
            state.loading = false;
            state.authenticated = true;
            state.error=null;
            state.user = action.payload.data;
        },
        [changePassword.pending]: (state, action) => {
            state.loading = true;
        },
        [changePassword.rejected]: (state, action) => {
            state.loading = false;
        },
        [getAllUsers.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
            state.users = action.payload.data;
        },
        [getAllUsers.pending]: (state, action) => {
            state.loading = true;
        },
        [getAllUsers.rejected]: (state, action) => {
            state.loading = false;
        },
        [adminRegister.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
        },
        [adminRegister.pending]: (state, action) => {
            state.loading = true;
        },
        [adminRegister.rejected]: (state, action) => {
            state.loading = false;
        },
        [adminUpdateUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
        },
        [adminUpdateUser.pending]: (state, action) => {
            state.loading = true;
        },
        [adminUpdateUser.rejected]: (state, action) => {
            state.loading = false;
        },
        [blockUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.error=null;
        },
        [blockUser.pending]: (state, action) => {
            state.loading = true;
        },
        [blockUser.rejected]: (state, action) => {
            state.loading = false;
        }

    }

});
export const {logout} = userSlice.actions;
export default userSlice.reducer;