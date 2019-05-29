import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { AmguPaymentsQuery, EngineQuery } from '~/queries/EngineQuery';
import moment from 'moment';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useScrapingQuery } from '~/utils/useScrapingQuery';
import Layout from '~/components/Layout';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type EngineProps = WithStyles<typeof styles>;

const Engine: React.FunctionComponent<EngineProps> = props => {
  const proceed = (current: any, expected: number) => {
    if (current.amguPayments && current.amguPayments.length === expected) {
      return true;
    }

    return false;
  };
  const result = useScrapingQuery([EngineQuery, AmguPaymentsQuery], proceed, { ssr: false });

  const amguPrices = (result.data && result.data.amguPrices) || [];
  const amguPayments = (result.data && result.data.amguPayments) || [];

  const amguCumulative: any[] = [];
  amguPayments.reduce((carry, item) => {
    amguCumulative.push({ ...item, cumulativeAmount: carry });
    return carry + parseInt(item.amount, 10);
  }, 0);

  return (
    <Layout title="Engine">
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Amgu Price</Typography>

          <ResponsiveContainer height={200} width="100%">
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
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Cumulative amgu paid</Typography>

          <ResponsiveContainer height={200} width="100%">
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
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Engine);
