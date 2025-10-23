import { useState, useEffect } from 'react';
import type { EChartsOption } from 'echarts';
import EchartsChart from '@/components/EchartsChart';
import tvlData from '@/data/tvlData.json';

const LineTVL = () => {
  const [option, setOption] = useState<EChartsOption>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const newOption: EChartsOption = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: tvlData.dates
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            data: tvlData.values,
            type: 'line',
            smooth: true
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

export default LineTVL;