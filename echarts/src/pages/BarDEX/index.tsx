import { useState, useEffect } from 'react';
import type { EChartsOption } from 'echarts';
import EchartsChart from '@/components/EchartsChart';
import dexData from '@/data/dexVolume.json';

const BarDEX = () => {
  const [option, setOption] = useState<EChartsOption>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const newOption: EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: dexData.names
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: dexData.values,
            type: 'bar'
          }
        ]
      };
      setOption(newOption);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <EchartsChart option={option} loading={loading} />
  );
};

export default BarDEX;