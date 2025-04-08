import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';



const Home = () => {
    //要保证DOM是可用的，所以使用useEffect，在组件渲染完成后执行
    const chartRef = useRef(null);
    useEffect(() => {
        //获取渲染图表的DOM节点
        // const chartDom = document.getElementById('main');
        //图表初始化，生成图表实例
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);
        //准备图表参数
        const option = {
            xAxis: {
                type: 'category',
                data: ['Vue', 'React', 'Angular']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [10, 40, 70],
                    type: 'bar'
                }
            ]
        };
        option && myChart.setOption(option);
    }, []);

    //图表节点必须有宽高才能渲染图表
    return (<div className="Home">
        <div ref={chartRef} style={{ width: '500px', height: '400px' }}></div>
    </div>)
}

export default Home;

