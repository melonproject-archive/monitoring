import React from 'react';

import { withStyles } from '@material-ui/styles';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import DarkUnica from 'highcharts/themes/dark-unica';
import { now } from 'moment';

if (typeof Highcharts === 'object') {
  DarkUnica(Highcharts);
}

export interface TSGroupedChartProps {
  data: any[];
  dataKeys: string[];
  referenceLine?: boolean;
  height?: number;
  yMin?: any;
  yMax?: any;
  loading?: boolean;
  page?: string;
}

const styles = (theme) => ({});

const TSGroupedChart: React.FunctionComponent<TSGroupedChartProps> = (props) => {
  const series = props.dataKeys.map((key) => {
    return {
      name: key,
      data: props.data.map((d) => {
        return [parseInt(d.timestamp, 10) * 1000, parseFloat(d[key])];
      }),
      type: 'column',
      dataGrouping: {
        forced: true,
        units: [['day', [1]]],
      },
    };
  });

  const options = {
    navigator: {
      baseSeries: 1,
      adaptToUpdatedData: false,
      series,
    },
    scrollbar: {
      liveRedraw: false,
    },
    rangeSelector: {
      selected: 0,
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
    <HighchartsReact key="mychart" highcharts={Highcharts} constructorType={'stockChart'} options={options} />
  );
};

export default withStyles(styles)(TSGroupedChart);
