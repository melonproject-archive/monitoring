import React from 'react';

import { withStyles } from '@material-ui/styles';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import DarkUnica from 'highcharts/themes/dark-unica';
import { now } from 'moment';

if (typeof Highcharts === 'object') {
  DarkUnica(Highcharts);
}

export interface TSChartProps {
  data: any;
  dataKeys: string[];
  height?: number;

  loading?: boolean;
}

const styles = (theme) => ({});

const TSLineChart: React.FunctionComponent<TSChartProps> = (props) => {
  const options = {
    chart: {
      type: 'spline',
    },
    navigator: {
      adaptToUpdatedData: false,
    },
    scrollbar: {
      liveRedraw: false,
    },
    rangeSelector: {
      selected: 1,
    },
    xAxis: {
      type: 'datetime',
      ordinal: false,
      minTickInterval: 28 * 24 * 3600 * 1000,
      max: now(),
    },
    yAxis: [
      {
        title: {
          text: 'Price',
        },
        height: '33%',
        lineWidth: 1,
      },
      {
        title: {
          text: 'Daily change (%)',
        },
        top: '33%',
        height: '33%',
        offset: 0,
        lineWidth: 1,
      },
      {
        title: {
          text: 'Aggregate value',
        },
        top: '66%',
        height: '33%',
        offset: 0,
        lineWidth: 1,
      },
    ],
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
    series: [
      {
        name: 'Price',
        data: props.data.priceHistory.map((d) => {
          return [parseInt(d.timestamp, 10) * 1000, parseFloat(d.price)];
        }),
      },
      {
        name: 'Daily change',
        data: props.data.priceHistory.map((d) => {
          return [parseInt(d.timestamp, 10) * 1000, parseFloat(d.dailyReturn)];
        }),
        yAxis: 1,
      },
      {
        name: 'Aggregate value',
        data: props.data.networkValues.map((d) => {
          return [parseInt(d.timestamp, 10) * 1000, parseFloat(d.amount)];
        }),
        yAxis: 2,
      },
    ],
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
              height: 500,
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

export default withStyles(styles)(TSLineChart);
