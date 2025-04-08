import './index.scss'
import { Card, Form, Input, Button } from 'antd'
import logo from '@/assets/logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLoginToken } from '@/store/modules/userSlice'
import { useNavigate } from 'react-router'
import { message } from 'antd';
import { useEffect } from 'react';
import { setLoginRequestStatus, setErrorMessage } from '@/store/modules/userSlice';
// 手机号校验规则
const phoneRules = [
    //多条校验逻辑，串行校验，一条不通过，不会校验下一条
    { required: true, message: 'Please enter your phone number!' },
    { pattern: /^1[3-9]\d{9}/, message: 'Please enter a valid phone number!' }
]
const codeRules = [
    { required: true, message: 'Please enter the verification code!' },
    { len: 6, message: 'Verification code must be 6 digits!' }
]
const initialValues = {
    mobile: '13800000002',
    code: '246810'
}

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loginRequestStatus, errorMessage } = useSelector(state => state.user);

    // 监听登录状态变化
    useEffect(() => {
        if (loginRequestStatus === 'succeeded') {
            message.destroy();
            message.success('登录成功');
            dispatch(setLoginRequestStatus('idle'));
            setTimeout(() => {
                message.destroy();
                navigate('/');
            }, 1500);
        } else if (loginRequestStatus === 'failed') {
            message.destroy();
            message.error('登录失败, ' + errorMessage);
            dispatch(setLoginRequestStatus('idle'));
            dispatch(setErrorMessage(''));
        }
    }, [loginRequestStatus, errorMessage, navigate, dispatch]);

    // 提交表单且数据验证成功后触发
    const onFinish = async (values) => {
        console.log('登录表单数据', values);
        //调用异步action
        await dispatch(fetchLoginToken(values));
    }

    return (
        <div className="login">
            <Card className="login-container">
                <img className="login-logo" src={logo} alt="" />
                {/* 登录表单 */}
                <Form onFinish={onFinish} initialValues={initialValues}>
                    <Form.Item
                        name="mobile"
                        rules={phoneRules}
                        validateTrigger={['onBlur']}
                    >
                        <Input size="large" placeholder="请输入手机号" value={"13800000002"} />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        validateTrigger={['onBlur']}
                        rules={codeRules}
                    >
                        <Input size="large" placeholder="请输入验证码" value={"246810"} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login