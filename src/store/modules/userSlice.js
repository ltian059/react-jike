// Create a Redux State Slice
import { createSlice } from '@reduxjs/toolkit'
import { axios } from '@/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd';
import { removeLocalStorageToken, setLocalStorageToken } from '@/utils/token'
/* token的持久化:
    1. 在登录成功后, 将token存入localStorage 和 redux中
    2. 在redux初始化时, 从localStorage中读取token; 这样就实现了token的持久化
*/


/* 和用户相关的状态管理 */
const initialState = {
    loginRequestStatus: 'idle',
    userInfoRequestStatus: 'idle',
    token: localStorage.getItem('token') || "",
    errorMessage: "",
    responseStatus: 0,
    userInfo: {},
}
export const userSlice = createSlice({
    name: 'user',
    // 初始化数据状态
    initialState: initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        setLoginRequestStatus: (state, action) => {
            state.loginRequestStatus = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        setUserInfoRequestStatus: (state, action) => {
            state.userInfoRequestStatus = action.payload;
        },
        onLogout: (state, action) => {
            // 清除本地存储的token
            removeLocalStorageToken();
            // 重置所有状态到初始值
            return {
                ...initialState,
                token: "",
                userInfoRequestStatus: 'succeeded', // 设置用户信息请求状态为成功，防止退出时重新获取用户信息
                loginRequestStatus: 'idle'
            };
        },
    },
    //使用extraReducers来响应在切片外部定义的异步action操作
    extraReducers: (builder) => {
        builder
            //用来处理fetchLoginToken异步请求的三种状态, user/fetchLoginToken/pending
            .addCase(fetchLoginToken.pending, (state, action) => {
                state.loginRequestStatus = 'pending';
                message.loading('登录中...');
                state.isLogout = false;
                state.userInfoRequestStatus = 'idle'; // 只要发起登录请求，就要重置用户信息
                state.userInfo = {};
                removeLocalStorageToken();
                state.token = "";
            })
            //user/fetchLoginToken/fulfilled
            .addCase(fetchLoginToken.fulfilled, (state, action) => {
                state.loginRequestStatus = 'succeeded';
                state.token = action.payload.token;
                setLocalStorageToken(state.token);
                state.errorMessage = "";
            })
            // user/fetchLoginToken/rejected
            .addCase(fetchLoginToken.rejected, (state, action) => {
                state.loginRequestStatus = 'failed';
                state.errorMessage = action.payload.message;
            })
            /*----------------- 获取用户信息的reducers-----------------*/
            .addCase(fetchUserInfo.pending, (state, action) => {
                state.userInfoRequestStatus = 'pending';
                state.userInfo.name = '用户信息加载中...';
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.userInfoRequestStatus = 'succeeded';
                state.userInfo = action.payload;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.userInfoRequestStatus = 'failed';
                state.responseStatus = action.payload;
            })
    }
})

// Action creators are generated for each case reducer function
export const { setErrorMessage, setLoginRequestStatus, setUserInfo, setUserInfoRequestStatus, setToken, onLogout } = userSlice.actions
export default userSlice.reducer

// 封装异步action
/* createAsyncThunk 创建一个异步action, 并自动dispatch三种action: pending, fulfilled, rejected 
    user/fetchLoginToken: 是这个异步action的前缀
    进行中会触发 pending 状态, user/fetchLoginToken/pending
    成功后会触发 fulfilled 状态, user/fetchLoginToken/fulfilled
    失败后会触发 rejected 状态, user/fetchLoginToken/rejected
*/
//异步action: 登录 获取token
const fetchLoginToken = createAsyncThunk('user/fetchLoginToken', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post('/v1_0/authorizations', data);
        return res.data; // 返回值会作为action.payload传递给reducers
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

//2. 异步action: 使用token获取用户信息
const fetchUserInfo = createAsyncThunk('user/fetchUserInfo', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.get('/v1_0/user/profile');
        return res.data; // 返回值会作为action.payload传递给reducers
    } catch (error) {
        return rejectWithValue(error.response.status);
    }
})


export { fetchLoginToken, fetchUserInfo }