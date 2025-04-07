// Create a Redux State Slice
import { createSlice } from '@reduxjs/toolkit'
import { axios } from '@/utils'

/* token的持久化:
    1. 在登录成功后, 将token存入localStorage 和 redux中
    2. 在redux初始化时, 从localStorage中读取token; 这样就实现了token的持久化
*/


/* 和用户相关的状态管理 */
export const userSlice = createSlice({
    name: 'user',
    // 初始化数据状态
    initialState: {
        token: localStorage.getItem('token') || "",
    },
    reducers: {
        setToken: (state, action) => {
            localStorage.setItem('token', action.payload)
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