/* 封装获取频道列表的hooks */
import { useState, useEffect } from 'react'
import { getChannelsAPI } from '@/apis/article'
//获取频道列表

/* 封装自定义hook:
    1. 自定义hook的函数名必须以use开头
    2. 封装要复用的业务逻辑
    3. 返回组件的需要用的状态数据
*/
export const useChannel = () => {
    const [channels, setChannels] = useState([]);
    useEffect(() => {
        const getChannels = async () => {
            const res = await getChannelsAPI()
            // console.log(res);
            setChannels(res.data.channels)
        }
        getChannels();
    }, [])
    return [channels];

}