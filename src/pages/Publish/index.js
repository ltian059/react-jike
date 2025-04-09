import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message
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
    // 上传图片回调
    const [fileList, setFileList] = useState([]);
    const handleUploadChange = (info) => {
        // console.log(info);
        if (info.file.status === 'error') {
            message.error(info.file.response.message);
        }
        if (info.file.status === 'removed') {
            setFileList(info.fileList);
        }
        if (info.file.status === 'done') {
            message.success('上传成功');
            setFileList(info.fileList);
        }
    }
    // 控制封面图片类型：单图1、三图3、无图0
    const [radioValue, setRadioValue] = useState(0);
    const onTypeChange = (e) => {
        setRadioValue(+e.target.value);
    }
    // 预览图片
    const handlePreview = (file) => {
        // 打开新页面预览图片
        window.open(file.response.data.url);
    }
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
                    initialValues={{ type: radioValue }}
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

                    <Form.Item label="封面">
                        <Form.Item name="type" onChange={onTypeChange}>
                            <Radio.Group>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {/* listType：决定文件选择框的外观样式
                            showUploadList：决定是否显示上传列表
                         */}
                        {radioValue > 0 &&
                            <Upload
                                name='image'
                                action='http://geek.itheima.net/v1_0/upload'
                                listType="picture-card"
                                showUploadList
                                maxCount={radioValue}
                                onPreview={handlePreview}
                                onChange={handleUploadChange}
                            >
                                <div style={{ marginTop: 8 }}>
                                    <PlusOutlined />
                                </div>
                            </Upload>

                        }
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