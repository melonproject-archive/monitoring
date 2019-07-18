import React from 'react';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import DarkUnica from 'highcharts/themes/dark-unica';

if (typeof Highcharts === 'object') {
  DarkUnica(Highcharts);
}

export interface TSChartProps {
  data: any[];
  dataKeys: string[];
  referenceLine?: boolean;
  height?: number;
  yMin?: any;
  yMax?: any;
  loading?: boolean;
  page?: string;
}

const styles: StyleRulesCallback = theme => ({});

// const lineColor = index => {
//   const lineColors = ['#00bfff', '#1e90ff', '#87cefa'];
//   const pick = index % lineColors.length;
//   return lineColors[pick];
// };

const TSLineChart: React.FunctionComponent<TSChartProps> = props => {
  const series = props.dataKeys.map(key => {
    return {
      name: key,
      data: props.data.map(d => {
        return [parseInt(d.timestamp, 10) * 1000, parseFloat(d[key])];
      }),
    };
  });

  const options = {
    page: props.page || '',
    chart: {
      type: 'spline',
    },
    xAxis: {
      type: 'datetime',
      minTickInterval: 28 * 24 * 3600 * 1000,
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#666666',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#666666',
        },
      },
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

    // <ResponsiveContainer height={props.height || 200} width="100%">
    //   {(props.loading && <CircularProgress />) || (
    //     <LineChart data={props.data}>
    //       {props.dataKeys.map((key, index) => (
    //         <Line key={key} type="monotone" dataKey={key} dot={false} stroke={lineColor(index)} />
    //       ))}
    //       <XAxis
    //         dataKey="timestamp"
    //         type="number"
    //         domain={['dataMin', 'dataMax']}
    //         tickFormatter={timeStr => formatDate(timeStr)}
    //         stroke="#dddddd"
    //       />
    //       <YAxis domain={[props.yMin || 0, props.yMax || 'auto']} stroke="#dddddd" />
    //       {props.referenceLine && <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />}

    //       <Tooltip
    //         labelFormatter={value => 'Date: ' + formatDate(value)}
    //         contentStyle={{ backgroundColor: '#4A4A4A' }}
    //       />
    //     </LineChart>
    //   )}
    // </ResponsiveContainer>
  );
};

export default withStyles(styles)(TSLineChart);
