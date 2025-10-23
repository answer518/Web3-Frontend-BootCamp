import * as echarts from 'echarts/core';
import {
  LineChart,
  BarChart,
  PieChart,
  CandlestickChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  LineChart,
  BarChart,
  PieChart,
  CandlestickChart,
  CanvasRenderer
]);

export default echarts;