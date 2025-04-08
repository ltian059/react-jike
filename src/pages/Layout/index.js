import { useEffect } from "react";
import axios from '@/utils/request'
const Layout = () => {
    //测试请求
    useEffect(() => {
        axios.get('/v1_0/user/profile').then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    return (
        <div>
            <h1>Layout Component</h1>
            <p>This is the layout component.</p>
        </div>
    );
}

export default Layout;