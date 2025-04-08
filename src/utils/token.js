/* 封装token相关操作 */
const TOKEN_KEY = 'token';
// 获取token
export const getLocalStorageToken = () => {
    return localStorage.getItem(TOKEN_KEY);
}

export const setLocalStorageToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
}

// 删除token
export const removeLocalStorageToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}

