/* 封装axios
    1. 根域名设置
    2. 处理请求时间
    3. 请求拦截器：
        3.1 请求头设置： 添加token, 
    4. 响应拦截器：
        4.1 提取数据
*/
import defaultAxios from "axios";
import { getLocalStorageToken, removeLocalStorageToken } from './token'
import { message } from "antd";
import router from "@/router";
//获取redux中的全局token
const axios = defaultAxios.create({
    baseURL: 'http://geek.itheima.net',
    timeout: 5000 // 5秒超时
})

// 添加请求拦截器,统一添加请求头token
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = getLocalStorageToken();
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

//添加响应拦截器, 提取数据
// 添加响应拦截器, 响应返回到客户端之前拦截
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么

    //401错误码，表示未授权，需要重新登录
    if (error.response.status === 401) {
        //身份状态过期，需要重新登录
        setTimeout(() => {
            removeLocalStorageToken();
            router.navigate('/login');
        }, 500);
    }
    return Promise.reject(error);
});


export default axios;