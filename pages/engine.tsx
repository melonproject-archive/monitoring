import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper, NoSsr } from '@material-ui/core';
import { AmguPaymentsQuery, EngineQuery } from '~/queries/EngineDetailsQuery';

import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import Layout from '~/components/Layout';
import { formatDate } from '~/utils/formatDate';
import { formatBigNumber } from '~/utils/formatBigNumber';
import TimeSeriesChart from '~/components/TimeSeriesChart';
import MaterialTable from 'material-table';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type EngineProps = WithStyles<typeof styles>;

const Engine: React.FunctionComponent<EngineProps> = props => {
  const result = useScrapingQuery([EngineQuery, AmguPaymentsQuery], proceedPaths(['amguPayments']), {
    ssr: false,
  });

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
          <Typography variant="h5">Melon Engine</Typography>
          <div>Amgu Price: {engineQuantities && formatBigNumber(engineQuantities.amguPrice, 18, 7)} MLN</div>
          <div>Thawing Delay: {engineQuantities && engineQuantities.thawingDelay / (24 * 3600)} days</div>
          <div>&nbsp;</div>
          <div>Frozen Ether: {engineQuantities && formatBigNumber(engineQuantities.frozenEther, 18, 3)} ETH</div>
          <div>Liquid Ether: {engineQuantities && formatBigNumber(engineQuantities.liquidEther, 18, 3)} ETH</div>
          <div>Last Thaw: {engineQuantities && formatDate(engineQuantities.lastThaw)}</div>
          <div>Total Ether Consumed: {engineQuantities && formatBigNumber(engineQuantities.totalEtherConsumed)}</div>
          <div>Total Amgu consumed: {engineQuantities && engineQuantities.totalAmguConsumed}</div>
          <div>Total MLN burned: {engineQuantities && formatBigNumber(engineQuantities.totalMlnBurned, 18, 3)}</div>
          <div>Premium percent: {engineQuantities && engineQuantities.premiumPercent}%</div>
          <div>&nbsp;</div>
          <div>Last update: {engineQuantities && formatDate(engineQuantities.lastUpdate, true)}</div>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Cumulative amgu paid</Typography>
          <TimeSeriesChart data={amguCumulative} dataKeys={['cumulativeAmount']} />
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Time',
                render: rowData => {
                  return formatDate(rowData.timestamp);
                },
              },
              {
                title: 'Event',
                field: 'event',
              },
              {
                title: 'Amount',
                render: rowData => {
                  return formatBigNumber(rowData.amount, 18, 3);
                },
                type: 'numeric',
              },
              {
                title: 'Asset',
                render: rowData => {
                  return rowData.event === 'Thaw' ? 'ETH' : 'MLN';
                },
              },
            ]}
            data={engineQuantities && engineQuantities.etherEvents}
            title="Engine events"
            options={{
              paging: false,
              search: false,
            }}
          />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Engine);
