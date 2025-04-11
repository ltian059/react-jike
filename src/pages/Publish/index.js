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
import { Link, useSearchParams } from 'react-router'
import './index.scss'
import { useEffect, useRef, useState } from 'react';
import Editor from './components/Editor';
import { Delta } from 'quill';
import { getArticleByIdAPI, getChannelsAPI, updateArticleAPI } from '@/apis/article'
import { submitArticleAPI } from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'
import dayjs from 'dayjs'
const Publish = () => {
    //实现编辑文字数据回显
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();
    const [id, setId] = useState(null);
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setId(id);
            const getArticle = async () => {
                const res = await getArticleByIdAPI(id);
                console.log(res);
                //调用Form组件的setFieldsValue方法，设置表单数据
                const data = res.data;
                // 创建一个新的对象来存储处理后的数据
                const processedData = {};
                Object.keys(data).forEach(key => {
                    if (key === 'content') {
                        try {
                            // 尝试解析 JSON
                            const parsedContent = JSON.parse(data[key]);
                            // 检查是否是 Delta 格式（包含 ops 数组）
                            if (parsedContent && Array.isArray(parsedContent.ops)) {
                                processedData[key] = new Delta(parsedContent);
                            } else {
                                processedData[key] = data[key];
                            }
                        } catch (e) {
                            // 如果不是有效的 JSON，则直接使用原始内容
                            processedData[key] = data[key];
                        }
                    } else if (key === 'cover') {
                        processedData.type = data[key].type;
                        setFileList(data[key].images.map(item => ({ url: item })));
                    } else {
                        processedData[key] = data[key];
                    }
                });
                // 一次性设置所有字段
                form.setFieldsValue(processedData);
                setRadioValue(processedData.type);
            }
            getArticle();
        }
    }, [searchParams, form]);
    const [channels] = useChannel();
    // 提交表单回调
    const handleSubmit = async (values) => {
        //校验封面类型是否符合要求
        if (radioValue === 1 && fileList.length !== 1) {
            message.error('单图封面，需要上传1张图片');
            return;
        }
        if (radioValue === 3 && fileList.length !== 3) {
            message.error('三图封面，需要上传3张图片');
            return;
        }
        //按照接口文档格式，处理表单数据
        const { title, channel_id, content } = values;
        if (!id) {
            //这里的formData是新增文章时的格式，编辑文章时，由于格式有变化，需要重新按照接口要求封装
            const formData = {
                title,
                content: JSON.stringify(content),
                cover: {
                    type: radioValue,
                    images: fileList.map(item => item.response.data.url),
                },
                channel_id,
            }
            console.log('新增文章');
            //新增文章
            //调用接口提交表单
            try {
                const res = await submitArticleAPI(formData);
                console.log(res);
                //发布成功后，得到文章在服务器中的id
                message.success('发布成功');
            } catch (error) {
                console.log(error);
            }
        } else {
            //编辑文章
            // console.log(values);
            //新增的图片和编辑时回显的图标数据格式不一样，需要重新封装
            const { content, type } = values;
            const formData = {
                ...values,
                content: JSON.stringify(content),
                cover: {
                    type,
                    images: fileList.map(item => {
                        if (item.response) {
                            return item.response.data.url;
                        } else {
                            return item.url;
                        }
                    })
                },
                // pub_date: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
            console.log('更新文章');
            try {
                // console.log(formData);
                const res = await updateArticleAPI(id, formData);
                message.success('更新成功');
            } catch (error) {
                console.log(error);
            }
        }
    }

    // const initialContent = new Delta()
    //     .insert('Hello')
    //     .insert('\n', { header: 1 })
    //     .insert('Some ')
    //     .insert('initial', { bold: true })
    //     .insert(' ')
    //     .insert('content', { underline: true })
    //     .insert('\n');

    // 上传图片回调
    const [fileList, setFileList] = useState([]);
    const handleUploadChange = (info) => {
        // console.log(info);
        setFileList(info.fileList); //这里必须双向绑定，否则无法上传图片
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
    const uploadRef = useRef();

    const onTypeChange = (e) => {
        const val = +e.target.value;
        setRadioValue(val);  // 更新 state
        if (val === 0) {
            setFileList([]);
        }
        else if (fileList.length > 0 && val === 1) {
            setFileList([fileList[fileList.length - 1]]);
        }
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
                        { title: id ? '编辑文章' : '发布文章' },
                    ]}
                    />
                }
            >
                <Form
                    form={form}
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
                        <Form.Item name="type">
                            <Radio.Group onChange={onTypeChange}>
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
                                ref={uploadRef}
                                name='image'
                                action='http://geek.itheima.net/v1_0/upload'
                                listType="picture-card"
                                showUploadList
                                maxCount={radioValue}
                                onPreview={handlePreview}
                                onChange={handleUploadChange}
                                fileList={fileList}
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