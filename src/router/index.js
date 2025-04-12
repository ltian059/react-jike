import { createBrowserRouter, } from "react-router";
import Login from "@/pages/Login";
import Layout from "@/pages/Layout";
import AuthRoute from "@/components/AuthRoute";
import { lazy, Suspense } from "react";
// 受保护的路由组件，嵌套在高阶组件中，防止未登录用户访问受保护的路由
const ProtectedLayout = () => {
    return <AuthRoute>
        <Layout />
    </AuthRoute>
}
// 实现组件懒加载，提高第一次进入页面加载速度
const withSuspense = (Component) => {
    return (
        //suspense是用于处理组件懒加载的，fallback是用于设置加载中的组件
        <Suspense fallback={<h1>加载中...</h1>}>
            <Component />
        </Suspense>
    );
}
// 实现组件懒加载，提高第一次进入页面加载速度
const Home = lazy(() => import("@/pages/Home"));
const Article = lazy(() => import("@/pages/Article"));
const Publish = lazy(() => import("@/pages/Publish"));

const router = createBrowserRouter([
    {
        path: "/",
        Component: ProtectedLayout,
        // 设置二级路由
        children: [
            {
                index: true,
                element: withSuspense(Home)
            },
            {
                path: "article",
                element: withSuspense(Article)
            },
            {
                path: "publish",
                element: withSuspense(Publish)
            },
        ],
    },
    {
        path: "/login",
        Component: Login,
    }
]);

export default router;
