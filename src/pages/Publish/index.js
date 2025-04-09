import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router'
import './index.scss'
import { useEffect, useRef, useState } from 'react';
import Editor from './components/Editor';
import { Delta } from 'quill';
import { getChannelsAPI } from '@/apis/article'
import { submitArticleAPI } from '@/apis/article'

const Publish = () => {
    //获取频道列表
    const [channels, setChannels] = useState([])
    useEffect(() => {
        const getChannels = async () => {
            const res = await getChannelsAPI()
            setChannels(res.data.channels)
        }
        getChannels();
    }, [])

    // 提交表单回调
    const handleSubmit = async (values) => {
        //按照接口文档格式，处理表单数据
        const { title, channel_id, content } = values;
        const formData = {
            title,
            content: JSON.stringify(content),
            cover: {
                type: 0,
                images: [],
            },
            channel_id,
        }
        console.log('Data to submit:', formData);
        //调用接口提交表单
        try {
            const res = await submitArticleAPI(formData);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    const initialContent = new Delta()
        .insert('Hello')
        .insert('\n', { header: 1 })
        .insert('Some ')
        .insert('initial', { bold: true })
        .insert(' ')
        .insert('content', { underline: true })
        .insert('\n');

    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb items={[
                        { title: <Link to={'/'}>首页</Link> },
                        { title: '发布文章' },
                    ]}
                    />
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1 }}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" style={{ width: 400 }} />
                    </Form.Item>
                    <Form.Item
                        label="频道"
                        name="channel_id"
                        rules={[{ required: true, message: '请选择文章频道' }]}
                    >
                        <Select
                            // value属性用户选择之后，会自动被Form收集
                            options={channels.map(channel => ({ label: channel.name, value: channel.id }))}
                            placement='bottomLeft'
                            placeholder="请选择文章频道" style={{ width: 200 }}>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="内容"
                        rules={[{ required: true, message: '请输入文章内容' }]}
                        name="content"
                        initialValue={initialContent}
                    >
                        {/* 富文本编辑器设置。它不是受控组件，要在Form.Item中使用需要进行改造 */}
                        <Editor
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                发布文章
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Publish