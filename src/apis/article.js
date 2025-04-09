/* 文章相关接口 */
import axios from '@/utils/request'

//1. 获取频道列表
export const getChannelsAPI = () => {
    return axios.get('/v1_0/channels')
}

//2. 发布文章
