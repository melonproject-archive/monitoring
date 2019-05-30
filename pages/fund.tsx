import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper, NoSsr } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { FundDetailsQuery } from '~/queries/FundDetailsQuery';
import { useRouter } from 'next/router';
import MaterialTable from 'material-table';
import { standardDeviation } from '../utils/finance';
import { formatDate } from '../utils/formatDate';
import Layout from '~/components/Layout';
import { formatBigNumber } from '~/utils/formatBigNumber';
import TimeSeriesChart from '~/components/TimeSeriesChart';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

type FundProps = WithStyles<typeof styles>;

const Fund: React.FunctionComponent<FundProps> = props => {
  const router = useRouter();
  const result = useQuery(FundDetailsQuery, {
    ssr: false,
    skip: !(router && router.query.address),
    variables: {
      fund: router && router.query.address,
    },
  });

  const fund = R.pathOr(undefined, ['data', 'fund'], result);
  const assets = R.pathOr([], ['data', 'assets'], result);

  const normalizedNumbers =
    fund &&
    fund.calculationsHistory.map((item, index, array) => {
      return {
        ...item,
        sharePrice: item.sharePrice ? formatBigNumber(item.sharePrice) : 0,
        gav: item.gav ? formatBigNumber(item.gav) : 0,
        nav: item.nav ? formatBigNumber(item.nav) : 0,
        totalSupply: item.totalSupply ? formatBigNumber(item.totalSupply) : 0,
        change: index > 0 ? (item.sharePrice / array[index - 1].sharePrice - 1) * 100 : 0,
        logReturn: index > 0 ? Math.log(item.sharePrice / array[index - 1].sharePrice) : 0,
      };
    });

  const returnSinceInception =
    normalizedNumbers &&
    (normalizedNumbers[normalizedNumbers.length - 1].sharePrice / normalizedNumbers[0].sharePrice - 1) * 100;
  const annualizedReturn =
    returnSinceInception &&
    normalizedNumbers &&
    (Math.pow(
      1 + returnSinceInception / 100,
      (60 * 60 * 24 * 365.25) /
        (normalizedNumbers[normalizedNumbers.length - 1].timestamp - normalizedNumbers[0].timestamp),
    ) -
      1) *
      100;

  const volatility =
    normalizedNumbers && standardDeviation(normalizedNumbers.map(item => item.logReturn)) * 100 * Math.sqrt(365.25);

  const shares = fund && fund.totalSupply && formatBigNumber(fund.totalSupply);
  const investmentHistory =
    fund &&
    fund.investmentHistory.map(item => {
      return {
        ...item,
        time: formatDate(item.timestamp),
        shares: item.shares ? formatBigNumber(item.shares) : 0,
        sharePrice: item.sharePrice ? formatBigNumber(item.sharePrice) : 0,
      };
    });

  const holdingsHistory = fund && fund.holdingsHistory;
  const holdingsLength = holdingsHistory && holdingsHistory.length;

  const groupedHoldingsLog: any[] = [];
  let ts = 0;
  for (let k = 0; k < holdingsLength; k++) {
    if (ts !== holdingsHistory[k].timestamp) {
      groupedHoldingsLog.push({
        timestamp: holdingsHistory[k].timestamp,
        [holdingsHistory[k].asset.symbol]: formatBigNumber(
          holdingsHistory[k].holding,
          holdingsHistory[k].asset.decimals,
        ),
      });
      ts = holdingsHistory[k].timestamp;
    } else {
      groupedHoldingsLog[groupedHoldingsLog.length - 1][holdingsHistory[k].asset.symbol] = formatBigNumber(
        holdingsHistory[k].holding,
        holdingsHistory[k].asset.decimals,
      );
    }
  }

  const investments =
    fund &&
    fund.investments.map(item => {
      return {
        ...item,
        shares: formatBigNumber(item.shares),
      };
    });

  return (
    <Layout title="Fund">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">{fund && fund.name}</Typography>
          <div>Address: {fund && fund.id}</div>
          <div>Manager: {fund && fund.manager.id}</div>
          <div># shares: {shares}</div>
          <div>&nbsp;</div>
          <div>Return since inception: {returnSinceInception && returnSinceInception.toFixed(2)}%</div>
          <div>Annualized return: {annualizedReturn && annualizedReturn.toFixed(2)}%</div>
          <div>Volatility: {volatility && volatility.toFixed(2)}%</div>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Share Price</Typography>
          <TimeSeriesChart data={normalizedNumbers} dataKeys={['sharePrice']} />
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">NAV</Typography>
          <TimeSeriesChart data={normalizedNumbers} dataKeys={['nav']} />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5"># Shares</Typography>
          <TimeSeriesChart data={normalizedNumbers} dataKeys={['totalSupply']} />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Daily change (%)</Typography>

          <TimeSeriesChart data={normalizedNumbers} dataKeys={['change']} referenceLine={true} />
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fund holdings</Typography>
          <TimeSeriesChart data={groupedHoldingsLog} dataKeys={assets.map(item => item.symbol)} />
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Investor',
                field: 'owner.id',
              },
              {
                title: 'Shares',
                field: 'shares',
                type: 'numeric',
              },
            ]}
            data={investments}
            title="Investors"
            options={{
              paging: false,
              search: false,
            }}
            onRowClick={(_, rowData) => {
              const url = '/investor?address=' + rowData.owner.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Time',
                field: 'timestamp',
                render: rowData => {
                  return formatDate(rowData.timestamp);
                },
              },
              {
                title: 'Investor',
                field: 'owner.id',
              },
              {
                title: 'Action',
                field: 'action',
              },
              {
                title: 'Shares',
                field: 'shares',
                type: 'numeric',
              },
              {
                title: 'Share Price',
                field: 'sharePrice',
                type: 'numeric',
              },
            ]}
            data={investmentHistory}
            title="Investment History"
            options={{
              paging: false,
              search: false,
            }}
            onRowClick={(_, rowData) => {
              const url = '/investor?address=' + rowData.owner.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Fund);
