import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import EngineQuery from '~/queries/EngineQuery';
import moment from 'moment';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const styles: StyleRulesCallback = theme => ({});

type FundProps = WithStyles<typeof styles>;

const Engine: React.FunctionComponent<FundProps> = props => {
  const result = useQuery(EngineQuery, {
    ssr: false,
  });

  const amguPrices = (result.data && result.data.amguPrices) || [];
  const amguPayments = (result.data && result.data.amguPayments) || [];

  return (
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        <ResponsiveContainer height={200} width="80%">
          <LineChart width={400} height={400} data={amguPrices}>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
            />
            <YAxis />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item={true} xs={12}>
        <ResponsiveContainer height={200} width="80%">
          <LineChart width={400} height={400} data={amguPayments}>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
            />
            <YAxis domain={[0, 5000000]} />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Engine);
