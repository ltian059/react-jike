import { Layout, Menu, Popconfirm } from 'antd'
import {
    HomeOutlined,
    DiffOutlined,
    EditOutlined,
    LogoutOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router'
import './index.scss'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserInfo, setUserInfoRequestStatus, setErrorMessage } from '@/store/modules/userSlice'
import { message } from 'antd'
const { Header, Sider } = Layout

const items = [
    {
        label: '首页',
        key: '/',
        icon: <HomeOutlined />,
    },
    {
        label: '文章管理',
        key: '/article',
        icon: <DiffOutlined />,
    },
    {
        label: '创建文章',
        key: '/publish',
        icon: <EditOutlined />,
    },
]
const GeekLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Menu点击，二级路由跳转
    const handleMenuClick = (e) => {
        if (!e?.key) {
            console.warn('Invalid menu key');
            return;
        }
        navigate(e.key);
    }
    // 使用 location.pathname 直接作为 selectedKey
    /* 当路由变化时：
        location.pathname 更新
        React Router 触发组件重渲染
        直接显示新的 location.pathname 
    */
    const selectedKey = location.pathname;

    // 获取用户信息
    const dispatch = useDispatch();
    const { userInfo, userInfoRequestStatus } = useSelector(state => state.user);
    const [retryCount, setRetryCount] = useState(0);
    // 获取用户信息并处理状态
    useEffect(() => {
        // 只在初始化和状态为 idle 时获取用户信息
        if (userInfoRequestStatus === 'idle') {
            dispatch(fetchUserInfo());
        }
        // 处理请求状态
        if (userInfoRequestStatus === 'succeeded') {
            // 获取用户信息成功，只清除错误信息
            dispatch(setErrorMessage(''));
        } else if (userInfoRequestStatus === 'failed') {
            if (retryCount <= 3) {
                // 获取用户信息失败，重新尝试获取
                setTimeout(() => {
                    setRetryCount(retryCount + 1);
                    dispatch(setUserInfoRequestStatus('idle'));
                }, 1000);
            } else {
                // 获取用户信息失败，显示错误信息
                dispatch(setUserInfoRequestStatus('failed'));
                message.error("获取用户信息失败, 请稍后再试");
            }
        }
    }, [userInfoRequestStatus, dispatch, retryCount]);

    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <div className="user-info">
                    <span className="user-name">{userInfo.name}</span>
                    <span className="user-logout">
                        <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消">
                            <LogoutOutlined /> 退出
                        </Popconfirm>
                    </span>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        theme="dark"
                        defaultSelectedKeys={['/']}
                        selectedKeys={[selectedKey]}
                        onClick={handleMenuClick}
                        items={items}
                        style={{ height: '100%', borderRight: 0 }}></Menu>
                </Sider>
                <Layout className="layout-content" style={{ padding: 20 }}>
                    {/* 设置二级路由的出口 */}
                    <Outlet />
                </Layout>
            </Layout>
        </Layout>
    )
}
export default GeekLayout