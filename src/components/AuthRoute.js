/* 
    封装高阶组件,用于判断用户是否登录
    如果登录,则跳转至指定页面,否则跳转至登录页面  
*/

import { getLocalStorageToken } from "@/utils";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const AuthRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    //在高阶组件渲染时，检查是否登录
    useEffect(() => {
        const token = getLocalStorageToken();
        if (!token) {
            console.log('没有token');
            navigate('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);

    return isAuthenticated ? <>{children}</> : null;
}

export default AuthRoute;
