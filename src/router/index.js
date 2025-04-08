import { createBrowserRouter, } from "react-router";
import Login from "@/pages/Login";
import Layout from "@/pages/Layout";
import AuthRoute from "@/components/AuthRoute";
import Home from "@/pages/Home";
import Article from "@/pages/Article";
import Publish from "@/pages/Publish";
// 受保护的路由组件，嵌套在高阶组件中，防止未登录用户访问受保护的路由
const ProtectedLayout = () => {
    return <AuthRoute>
        <Layout />
    </AuthRoute>
}

const router = createBrowserRouter([
    {
        path: "/",
        Component: ProtectedLayout,
        // 设置二级路由
        children: [
            { index: true, Component: Home },
            { path: "article", Component: Article },
            { path: "publish", Component: Publish },
        ],
    },
    {
        path: "/login",
        Component: Login,
    }
]);

export default router;
