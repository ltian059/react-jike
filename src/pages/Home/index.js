import { useEffect, useRef } from 'react';
import BarChart from './components/BarChart';


const Home = () => {
    //图表数据
    const data = {
        xAxis: {
            data: ['Vue', 'React', 'Angular']
        },
        series: {
            data: [10, 40, 70]
        }
    }

    //图表节点必须有宽高才能渲染图表
    return (<div className="Home">
        <BarChart title="三大框架满意度" height='400px' data={data} />
        <BarChart title="三大框架使用度" height='400px' data={data} />
    </div>)
}

export default Home;

