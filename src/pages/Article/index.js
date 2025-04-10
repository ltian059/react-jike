import { Link } from 'react-router'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'

// 导入资源
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useChannel } from '@/hooks/useChannel'
import { getArticleListAPI } from '@/apis/article'
import { useEffect, useState } from 'react'
const { Option } = Select
const { RangePicker } = DatePicker
/* 文章管理页面 */
const Article = () => {
    // 准备列数据
    const columns = [
        {
            title: '封面',
            dataIndex: 'cover',
            width: 120,
            render: cover => {
                return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
            }
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: data => <Tag color="green">审核通过</Tag>
        },
        {
            title: '发布时间',
            dataIndex: 'pubdate'
        },
        {
            title: '阅读数',
            dataIndex: 'read_count'
        },
        {
            title: '评论数',
            dataIndex: 'comment_count'
        },
        {
            title: '点赞数',
            dataIndex: 'like_count'
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button type="primary" shape="circle" icon={<EditOutlined />} />
                        <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                        />
                    </Space>
                )
            }
        }
    ]
    // 准备表格body数据
    const data = [
        {
            id: '8218',
            comment_count: 0,
            cover: {
                images: [],
            },
            like_count: 0,
            pubdate: '2019-03-11 09:00:00',
            read_count: 2,
            status: 2,
            title: 'wkwebview离线化加载h5资源解决方案'
        }
    ]
    const [channels] = useChannel();

    //获取文章列表
    const [articleList, setArticleList] = useState([]);
    //文章总数
    const [totalCount, setTotalCount] = useState(0);
    useEffect(() => {
        const getArticleList = async () => {
            const res = await getArticleListAPI();
            console.log(res);
            setArticleList(res.data.results);
            setTotalCount(res.data.total_count);
        }
        getArticleList();
    }, [])
    return (
        <div>
            <Card
                title={
                    <Breadcrumb items={[
                        { title: <Link to={'/'}>首页</Link> },
                        { title: '文章列表' },
                    ]} />
                }
                style={{ marginBottom: 20 }}
            >
                <Form initialValues={{ status: '', channel_id: { value: 0, label: '推荐' } }}>
                    <Form.Item label="状态" name="status">
                        <Radio.Group>
                            <Radio value={''}>全部</Radio>
                            <Radio value={0}>草稿</Radio>
                            <Radio value={2}>审核通过</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="频道" name="channel_id">
                        <Select
                            options={channels.map(item => ({ value: item.id, label: item.name }))}
                            placeholder="请选择文章频道"
                            style={{ width: 120 }}
                        >
                        </Select>
                    </Form.Item>

                    <Form.Item label="日期" name="date">
                        {/* 传入locale属性 控制中文显示*/}
                        <RangePicker></RangePicker>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/*        */}
            <Card title={`根据筛选条件共查询到 ${totalCount} 条结果：`}>
                <Table rowKey="id" columns={columns} dataSource={articleList} />
            </Card>

        </div>
    )
}

export default Article