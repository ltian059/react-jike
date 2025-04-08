/* 封装用户相关请求接口 */
import axios from '@/utils/request';


//1. 登录请求
export const loginAPI = (data) => {
    return axios.post('/v1_0/authorizations', data);
}

//2. 获取用户信息
export const getUserInfoAPI = () => {
    return axios.get('/v1_0/user/profile');
}