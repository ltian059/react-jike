/* 文章相关接口 */
import axios from '@/utils/request'

//1. 获取频道列表
export const getChannelsAPI = () => {
    return axios.get('/v1_0/channels')
}

//2. 提交文章表单
export const submitArticleAPI = (data) => {
    return axios({
        url: '/v1_0/mp/articles',
        method: 'POST',
        params: {
            draft: false
        },
        data
    });
}   
