import { createBrowserRouter, } from "react-router";
import Login from "@/pages/Login";
import Layout from "@/pages/Layout";
import AuthRoute from "@/components/AuthRoute";

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
    },
    {
        path: "/login",
        Component: Login,
    }
]);

export default router;
