// Create a Redux State Slice
import { createSlice } from '@reduxjs/toolkit'
import { axios } from '@/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd';
/* token的持久化:
    1. 在登录成功后, 将token存入localStorage 和 redux中
    2. 在redux初始化时, 从localStorage中读取token; 这样就实现了token的持久化
*/


/* 和用户相关的状态管理 */
export const userSlice = createSlice({
    name: 'user',
    // 初始化数据状态
    initialState: {
        loginRequestStatus: 'idle',
        token: localStorage.getItem('token') || "",
        errorMessage: "",
    },
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
    },

    //使用extraReducers来响应在切片外部定义的异步action操作
    extraReducers: (builder) => {
        builder
            //用来处理fetchLoginToken异步请求的三种状态, user/fetchLoginToken/pending
            .addCase(fetchLoginToken.pending, (state, action) => {
                console.log('登录中, 正在发送请求');
                state.loginRequestStatus = 'pending';
                message.loading('登录中...');
            })
            //user/fetchLoginToken/fulfilled
            .addCase(fetchLoginToken.fulfilled, (state, action) => {
                state.loginRequestStatus = 'succeeded';
                // console.log('登录成功, 获取到返回值data', action.payload);
                state.token = action.payload.token;
                localStorage.setItem('token', state.token);
                state.errorMessage = "";
            })
            // user/fetchLoginToken/rejected
            .addCase(fetchLoginToken.rejected, (state, action) => {
                state.loginRequestStatus = 'failed';
                console.log('登录失败, 获取到返回值data', action);
                state.errorMessage = action.payload.data.message;
            });
    }
})

// Action creators are generated for each case reducer function
export const { setToken, setErrorMessage, setLoginRequestStatus } = userSlice.actions
export default userSlice.reducer

// 封装异步action
/* createAsyncThunk 创建一个异步action, 并自动dispatch三种action: pending, fulfilled, rejected 
    user/fetchLoginToken: 是这个异步action的前缀
    进行中会触发 pending 状态, user/fetchLoginToken/pending
    成功后会触发 fulfilled 状态, user/fetchLoginToken/fulfilled
    失败后会触发 rejected 状态, user/fetchLoginToken/rejected
*/
const fetchLoginToken = createAsyncThunk('user/fetchLoginToken', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post('/v1_0/authorizations', data);
        return res.data; // 返回值会作为action.payload传递给reducers
    } catch (error) {
        return rejectWithValue(error.response);
    }

})

export { fetchLoginToken }