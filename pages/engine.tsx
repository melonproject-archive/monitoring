import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import EngineQuery from '~/queries/EngineQuery';
import moment from 'moment';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const styles: StyleRulesCallback = theme => ({});

type EngineProps = WithStyles<typeof styles>;

const Engine: React.FunctionComponent<EngineProps> = props => {
  const result = useQuery(EngineQuery, {
    ssr: false,
  });

  const amguPrices = (result.data && result.data.amguPrices) || [];
  const amguPayments = (result.data && result.data.amguPayments) || [];

  const amguCumulative: any[] = [];
  amguPayments.reduce((carry, item) => {
    amguCumulative.push({ ...item, cumulativeAmount: carry });
    return carry + parseInt(item.amount, 10);
  }, 0);

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
            <Line type="stepAfter" dataKey="price" stroke="#8884d8" dot={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item={true} xs={12}>
        <ResponsiveContainer height={200} width="80%">
          <LineChart width={400} height={400} data={amguCumulative}>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
            />
            <YAxis domain={[0, 5000000]} />
            <Line type="linear" dataKey="cumulativeAmount" dot={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Engine);
