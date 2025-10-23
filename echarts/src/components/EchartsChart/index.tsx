import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '@/utils/echarts';
import type { EChartsOption } from 'echarts';
import styles from './index.module.css';

/**
 * Props for the EchartsChart component.
 */
interface EchartsChartProps {
  /** The ECharts option object. */
  option: EChartsOption;
  /** Optional inline styles for the chart container. */
  style?: React.CSSProperties;
  /** Whether to show the loading animation. */
  loading?: boolean;
}

/**
 * A reusable component for rendering ECharts charts.
 * @param {EchartsChartProps} props - The component props.
 * @returns {React.ReactElement} The rendered chart component.
 */
const EchartsChart: React.FC<EchartsChartProps> = ({ option, style, loading }) => {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      notMerge={true}
      lazyUpdate={true}
      theme={"light"}
      className={styles.chart}
      style={style}
      showLoading={loading}
    />
  );
};

export default EchartsChart;