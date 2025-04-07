import { createBrowserRouter, } from "react-router";
import Login from "@/pages/Login";
import Layout from "@/pages/Layout";




const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
    },
    {
        path: "/login",
        Component: Login,
    }
]);

export default router;
