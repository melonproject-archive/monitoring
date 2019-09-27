import React from 'react';

import * as R from 'ramda';
import {
  Grid,
  withStyles,
  WithStyles,
  StyleRulesCallback,
  Typography,
  Paper,
  NoSsr,
  CircularProgress,
} from '@material-ui/core';
import { AmguPaymentsQuery, EngineQuery } from '~/queries/EngineDetailsQuery';

import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import Layout from '~/components/Layout';
import { formatDate } from '~/utils/formatDate';
import { formatBigNumber } from '~/utils/formatBigNumber';
import MaterialTable from 'material-table';
import { formatThousands } from '~/utils/formatThousands';
import TooltipNumber from '~/components/TooltipNumber';
import { sortBigNumber } from '~/utils/sortBigNumber';
import LineItem from '~/components/LineItem';
import TSAreaChart from '~/components/TSAreaChart';

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

  const engineQuantities = R.pathOr({}, ['data', 'state', 'currentEngine'], result) as any;

  return (
    <Layout title="Melon Engine" page="engine">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Melon Engine</Typography>
          <br />
          <Grid container={true}>
            <LineItem name="Total Amgu Consumed">
              {engineQuantities && formatThousands(engineQuantities.totalAmguConsumed)}
            </LineItem>
            <LineItem name="Amgu Price">
              {engineQuantities && formatBigNumber(engineQuantities.amguPrice, 18, 7)} MLN
            </LineItem>
            <LineItem name="MLN burned">
              <TooltipNumber number={engineQuantities.totalMlnBurned} digits={0} /> MLN
            </LineItem>
            <LineItem name="Total MLN supply">
              {engineQuantities && formatThousands(formatBigNumber(engineQuantities.mlnTotalSupply, 18, 0))}
            </LineItem>
            <LineItem name="ETH consumed">
              <TooltipNumber number={engineQuantities.totalEtherConsumed} /> ETH
            </LineItem>
            <LineItem name="Engine premium" linebreak={true}>
              {engineQuantities && engineQuantities.premiumPercent}%
            </LineItem>

            <LineItem name="Frozen ETH">
              <TooltipNumber number={engineQuantities.frozenEther} /> ETH
            </LineItem>
            <LineItem name="Liquid ETH">
              <TooltipNumber number={engineQuantities.liquidEther} /> ETH
            </LineItem>
            <LineItem name="Last thaw">{engineQuantities && formatDate(engineQuantities.lastThaw, true)}</LineItem>
            <LineItem name="Thawing delay">
              {engineQuantities && engineQuantities.thawingDelay / (24 * 3600)} days
            </LineItem>
          </Grid>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Amgu consumed</Typography>
          {(result.loading && <CircularProgress />) || (
            <>
              <TSAreaChart data={amguCumulative} dataKeys={['cumulativeAmount']} />
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Time',
                render: rowData => {
                  return formatDate(rowData.timestamp, true);
                },
                customSort: (a, b) => sortBigNumber(a, b, 'timestamp'),
                defaultSort: 'desc',
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Event',
                field: 'event',
              },
              {
                title: 'Amount',
                render: rowData => {
                  return <TooltipNumber number={rowData.amount} />;
                },
                type: 'numeric',
                sorting: false,
              },
              {
                title: 'Asset',
                render: rowData => {
                  return rowData.event === 'Thaw' ? 'ETH' : 'MLN';
                },
                sorting: false,
              },
            ]}
            data={engineQuantities && engineQuantities.etherEvents}
            title="Engine events"
            options={{
              paging: false,
              search: false,
            }}
            onRowClick={(_, rowData) => {
              const url = 'https://etherscan.io/tx/' + rowData.id;
              window.open(url, '_blank');
            }}
          />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Engine);
