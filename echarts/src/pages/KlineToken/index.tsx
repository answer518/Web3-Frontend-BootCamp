import { useState, useEffect } from 'react';
import type { EChartsOption } from 'echarts';
import EchartsChart from '@/components/EchartsChart';
import priceData from '@/data/tokenPrice.json';

/**
 * Calculates the moving average for a given period.
 * @param {number} dayCount - The number of days to calculate the moving average over.
 * @param {number[][]} data - The input data, an array of arrays where each inner array is [timestamp, value].
 * @returns {Array<number | '-'>} The calculated moving average data.
 */
function calculateMA(dayCount: number, data: number[][]) {
  const result = [];
  for (let i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += data[i - j][1];
    }
    result.push(sum / dayCount);
  }
  return result;
}

const KlineToken = () => {
  const [option, setOption] = useState<EChartsOption>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const newOption: EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          data: priceData.dates
        },
        yAxis: {},
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
            type: 'candlestick',
            data: priceData.prices
          },
          {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5, priceData.prices),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10, priceData.prices),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA20',
            type: 'line',
            data: calculateMA(20, priceData.prices),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
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

export default KlineToken;