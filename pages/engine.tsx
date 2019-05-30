import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { AmguPaymentsQuery, EngineQuery } from '~/queries/EngineQuery';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useScrapingQuery } from '~/utils/useScrapingQuery';
import Layout from '~/components/Layout';
import { formatDate } from '~/utils/formatDate';
import { formatBigNumber } from '~/utils/formatBigNumber';

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

  const amguPayments = (result.data && result.data.amguPayments) || [];

  const amguCumulative: any[] = [];
  amguPayments.reduce((carry, item) => {
    amguCumulative.push({ ...item, cumulativeAmount: carry });
    return carry + parseInt(item.amount, 10);
  }, 0);

  const engineQuantities = result.data && result.data.state && result.data.state.currentEngine;

  return (
    <Layout title="Engine">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Melon Engine Parameters</Typography>
          <div>Amgu Price: {engineQuantities && formatBigNumber(engineQuantities.amguPrice, 18, 7)} MLN</div>
          <div>Thawing Delay: {engineQuantities && engineQuantities.thawingDelay / (24 * 3600)} days</div>
          <div>-</div>
          <div>Frozen Ether: {engineQuantities && formatBigNumber(engineQuantities.frozenEther, 18, 3)} ETH</div>
          <div>Liquid Ether: {engineQuantities && formatBigNumber(engineQuantities.liquidEther, 18, 3)} ETH</div>
          <div>Last Thaw: {engineQuantities && formatDate(engineQuantities.lastThaw)}</div>
          <div>Total Ether Consumed: {engineQuantities && formatBigNumber(engineQuantities.totalEtherConsumed)}</div>
          <div>Total Amgu consumed: {engineQuantities && engineQuantities.totalAmguConsumed}</div>
          <div>Total MLN burned: {engineQuantities && formatBigNumber(engineQuantities.totalMlnBurned, 18, 3)}</div>
          <div>Premium percent: {engineQuantities && engineQuantities.premiumPercent}%</div>
          <div>Last update: {engineQuantities && formatDate(engineQuantities.lastUpdate)}</div>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Cumulative amgu paid</Typography>

          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={amguCumulative}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => formatDate(timeStr)}
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
