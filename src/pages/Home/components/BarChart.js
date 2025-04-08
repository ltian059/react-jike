import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
/* 
    封装echarts图表组件
    参数：
        title: 图表标题
        height: 图表高度
        width: 图表宽度
        data: 图表数据
*/


const BarChart = (props) => {
    //要保证DOM是可用的，所以使用useEffect，在组件渲染完成后执行
    const chartRef = useRef(null);
    const height = props.height || '400px';
    const width = props.width || '500px';
    useEffect(() => {
        //图表初始化，生成图表实例
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);
        //准备图表参数
        const option = {
            title: {
                text: props.title,
            },
            xAxis: {
                type: 'category',
                data: props.data.xAxis.data
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: props.data.series.data,
                    type: 'bar'
                }
            ]
        };
        option && myChart.setOption(option);
    }, [props.title]);

    return (
        <div ref={chartRef} style={{ width, height }}></div>
    )
}

export default BarChart;
