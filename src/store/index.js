/* 组合redux模块, 导出store实例 */
import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/store/modules/userSlice'
export default configureStore({
    // Add Slice Reducers to the Store
    reducer: {
        user: userReducer
    }
})