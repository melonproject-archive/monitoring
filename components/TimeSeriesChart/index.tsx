import React from 'react';

import { formatDate } from '~/utils/formatDate';
import { withStyles } from '@material-ui/styles';
import { CircularProgress } from '@material-ui/core';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, Tooltip, ReferenceLine } from 'recharts';

export interface TimeSeriesChartProps {
  data: any[];
  dataKeys: string[];
  referenceLine?: boolean;
  height?: number;
  yMin?: any;
  yMax?: any;
  loading?: boolean;
}

const styles = theme => ({});

const lineColor = index => {
  const lineColors = ['#00bfff', '#1e90ff', '#87cefa'];
  const pick = index % lineColors.length;
  return lineColors[pick];
};

const TimeSeriesChart: React.FunctionComponent<TimeSeriesChartProps> = props => {
  return (
    <ResponsiveContainer height={props.height || 200} width="100%">
      {(props.loading && <CircularProgress />) || (
        <LineChart data={props.data}>
          {props.dataKeys.map((key, index) => (
            <Line key={key} type="monotone" dataKey={key} dot={false} stroke={lineColor(index)} />
          ))}
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={timeStr => formatDate(timeStr)}
            stroke="#dddddd"
          />
          <YAxis domain={[props.yMin || 0, props.yMax || 'auto']} stroke="#dddddd" />
          {props.referenceLine && <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />}

          <Tooltip
            labelFormatter={value => 'Date: ' + formatDate(value)}
            contentStyle={{ backgroundColor: '#4A4A4A' }}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

export default withStyles(styles)(TimeSeriesChart);
