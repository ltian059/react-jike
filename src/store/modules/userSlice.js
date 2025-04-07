// Create a Redux State Slice
import { createSlice } from '@reduxjs/toolkit'
import { axios } from '@/utils'

/* 和用户相关的状态管理 */
export const userSlice = createSlice({
    name: 'user',
    // 初始化数据状态
    initialState: {
        token: "",
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { setToken } = userSlice.actions
export default userSlice.reducer

// 封装异步action
const fetchLoginToken = (data) => {
    return async (dispatch) => {
        //1. 发送异步请求
        const res = await axios.post('/v1_0/authorizations', data)
        console.log('登录操作,接口返回数据', res);
        //2. 提交同步action, 存入token
        dispatch(setToken(res.data.token))
    }
}

export { fetchLoginToken }