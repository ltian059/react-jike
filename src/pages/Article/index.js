import { Link, useNavigate } from 'react-router'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Popconfirm, message } from 'antd'

// 导入资源
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useChannel } from '@/hooks/useChannel'
import { deleteArticleAPI, getArticleListAPI } from '@/apis/article'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { current } from '@reduxjs/toolkit'
const { Option } = Select
const { RangePicker } = DatePicker
/* 文章管理页面 */
const Article = () => {
    const navigate = useNavigate();
    //枚举文章状态
    const statusEnum = {
        0: <Tag color='warning'>草稿</Tag>,
        1: <Tag color='warning'>待审核</Tag>,
        2: <Tag color='success'>审核通过</Tag>,
        3: <Tag color='error'>审核失败</Tag>
    }
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
            render: data => {
                // data为每一行数据status字段的值
                return statusEnum[data]
            }
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

                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(data)} />
                        <Popconfirm
                            title="删除文章"
                            description="您确定要删除这篇文章吗"
                            onConfirm={() => handleDelete(data)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ]
    const handleEdit = (data) => {
        navigate(`/publish/?id=${data.id}`);
    }
    // 删除文章
    const handleDelete = async (data) => {
        console.log(data);
        // 调用删除接口
        const res = await deleteArticleAPI(data.id);
        console.log(res);
        //提示用户
        message.success('删除成功');
        //修改依赖项，触发useEffect
        setTimeout(() => {
            if (reqParams.page > 1 && articleList.length === 1) {
                setReqParams({
                    ...reqParams,
                    page: reqParams.page - 1,
                })
            } else {
                setReqParams({
                    ...reqParams,
                })
            }
        }, 1000)
    }
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

    // 筛选文章
    // 设置请求参数状态，方便后续使用
    const [reqParams, setReqParams] = useState({
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 10,
    })

    const handleFilterArticle = async (values) => {
        // console.log(values);
        if (!values.date) {
            values.date = [null, null]
        }
        const params = {
            status: values.status + '',
            channel_id: values.channel_id,
            begin_pubdate: values.date[0] ? values.date[0].format('YYYY-MM-DD') : '',
            end_pubdate: values.date[1] ? values.date[1].format('YYYY-MM-DD') : '',
            page: 1,
            per_page: 5,
        }
        setReqParams(params)
        // 不用调用接口，因为已经通过useEffect调用
    }
    // 点击分页器时的回调函数
    const onPageChange = (page, pageSize) => {
        // 更新请求参数，触发useEffect
        setReqParams({
            ...reqParams,
            page,
            per_page: pageSize,
        })
    }
    //获取文章列表
    const [articleList, setArticleList] = useState([]);
    //文章总数
    const [totalCount, setTotalCount] = useState(0);
    // 分页器配置
    const [paginationConfig, setPaginationConfig] = useState({});

    useEffect(() => {
        const getArticleList = async () => {
            const res = await getArticleListAPI(reqParams);
            // console.log(res);
            setArticleList(res.data.results);
            setTotalCount(res.data.total_count);
        }
        getArticleList();

        setPaginationConfig({
            total: totalCount,
            current: reqParams.page,
            pageSize: reqParams.per_page,
            onChange: onPageChange,
        })
        // 依赖项，当reqParams变化时，重新调用getArticleList
    }, [reqParams, totalCount])

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
                <Form initialValues={{ status: '', channel_id: { value: 0, label: '推荐' } }} onFinish={handleFilterArticle}>
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
                        <RangePicker allowEmpty={[true, true]}></RangePicker>
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
                <Table rowKey="id" columns={columns} dataSource={articleList} pagination={paginationConfig} />
            </Card>

        </div>
    )
}

export default Article