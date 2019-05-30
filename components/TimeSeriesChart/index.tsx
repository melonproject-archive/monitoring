import React from 'react';

import { formatDate } from '~/utils/formatDate';
import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, Tooltip, ReferenceLine } from 'recharts';

export interface TimeSeriesChartProps {
  data: any;
  dataKeys: string[];
  referenceLine?: boolean;
}

const styles: StyleRulesCallback = theme => ({});

const TimeSeriesChart: React.FunctionComponent<TimeSeriesChartProps> = props => {
  return (
    <ResponsiveContainer height={200} width="100%">
      <LineChart data={props.data}>
        <XAxis
          dataKey="timestamp"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={timeStr => formatDate(timeStr)}
          stroke="#dddddd"
        />
        <YAxis stroke="#dddddd" />
        {props.referenceLine && <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />}
        {props.dataKeys.map(key => (
          <Line key={key} type="monotone" dataKey={key} dot={false} stroke="#aaaaaa" />
        ))}
        <Tooltip labelFormatter={value => 'Date: ' + formatDate(value)} contentStyle={{ backgroundColor: '#4A4A4A' }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default withStyles(styles)(TimeSeriesChart);
