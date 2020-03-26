import React from 'react';

import { withStyles } from '@material-ui/styles';

import Highcharts from 'highcharts/highstock';

import HighchartsReact from 'highcharts-react-official';
import DarkUnica from 'highcharts/themes/dark-unica';
import { now } from 'moment';

if (typeof Highcharts === 'object') {
  DarkUnica(Highcharts);
}

export interface TSAreaChartProps {
  data: any[];
  dataKeys: string[];
  referenceLine?: boolean;
  height?: number;
  yMin?: any;
  yMax?: any;
  loading?: boolean;
}

const styles = () => ({});

// const lineColor = index => {
//   const lineColors = ['#00bfff', '#1e90ff', '#87cefa'];
//   const pick = index % lineColors.length;
//   return lineColors[pick];
// };

const TSAreaChart: React.FunctionComponent<TSAreaChartProps> = (props) => {
  const series = props.dataKeys.map((key) => {
    return {
      name: key,
      data: props.data.map((d) => {
        return [parseInt(d.timestamp, 10) * 1000, parseFloat(d[key])];
      }),
    };
  });

  const options = {
    chart: {
      type: 'spline',
      // events: {
      //   load() {
      //     this.showLoading();
      //   },
      // },
    },
    navigator: {
      adaptToUpdatedData: false,
    },
    scrollbar: {
      liveRedraw: false,
    },
    rangeSelector: {
      selected: 5,
    },
    xAxis: {
      type: 'datetime',
      ordinal: false,
      minTickInterval: 28 * 24 * 3600 * 1000,
      max: now(),
    },
    colors: [
      '#00bfff',
      '#1e90ff',
      '#87cefa',
      '#7798BF',
      '#aaeeee',
      '#ff0066',
      '#eeaaee',
      '#55BF3B',
      '#DF5353',
      '#7798BF',
      '#aaeeee',
    ],
    series,
    credits: {
      enabled: false,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            chart: {
              height: 300,
            },
            subtitle: {
              text: null,
            },
            navigator: {
              enabled: false,
            },
          },
        },
      ],
    },
  };

  return (
    // @ts-ignore
    <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
  );
};

export default withStyles(styles)(TSAreaChart);
