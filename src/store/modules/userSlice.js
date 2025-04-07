// Create a Redux State Slice
import { createSlice } from '@reduxjs/toolkit'


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