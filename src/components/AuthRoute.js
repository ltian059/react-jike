/* 
    封装高阶组件,用于判断用户是否登录
    如果登录,则跳转至指定页面,否则跳转至登录页面  
*/

import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AuthRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { token } = useSelector(state => state.user);
    //在高阶组件渲染时，检查是否登录
    //这里使用redux中的token，而不是localStorage中的token，因为当redux中的token被清除时，高阶组件可以监听到，从而及时反应
    useEffect(() => {
        // const token = getLocalStorageToken();
        if (!token) {
            console.log('没有token');
            navigate('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate, token]);

    return isAuthenticated ? <>{children}</> : null;
}

export default AuthRoute;
