import { useState, useEffect } from 'react';
import type { EChartsOption } from 'echarts';
import EchartsChart from '@/components/EchartsChart';
import tokenData from '@/data/tokenHolders.json';

const PieHolders = () => {
  const [option, setOption] = useState<EChartsOption>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const newOption: EChartsOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Token Holders',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: tokenData.data
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

export default PieHolders;