import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper, NoSsr } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import InvestorDetailsQuery from '~/queries/InvestorDetailsQuery';
import Layout from '~/components/Layout';
import TimeSeriesChart from '~/components/TimeSeriesChart';
import { formatBigNumber } from '~/utils/formatBigNumber';
import InvestmentList from '~/components/InvestmentList';
import InvestorActivity from '~/components/InvestorActivity';
import BigNumber from 'bignumber.js';
import { robustIRR } from '~/utils/robustIRR';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type InvestorProps = WithStyles<typeof styles>;

const Investor: React.FunctionComponent<InvestorProps> = props => {
  const router = useRouter();
  const result = useQuery(InvestorDetailsQuery, {
    ssr: false,
    skip: !(router && router.query.address),
    variables: {
      investor: router && router.query.address,
    },
  });

  const prepareCashFlows = (history, currentValue: string) => {
    const investmentCashFlows = history.map(item => {
      let pre = '';
      if (item.action === 'Investment') {
        pre = '-';
      }
      const amount = new BigNumber(pre + item.amountInDenominationAsset);
      return {
        amount: parseFloat(formatBigNumber(amount.toString())),
        date: new Date(item.timestamp * 1000),
      };
    });
    const cashflows = [
      ...investmentCashFlows,
      {
        amount: parseFloat(formatBigNumber(currentValue.toString(), 18, 3)),
        date: new Date(),
      },
    ];
    return cashflows;
  };

  const investor = R.pathOr(undefined, ['data', 'investor'], result);
  const investments = R.pathOr([], ['data', 'investor', 'investments'], result).map(inv => {
    const valuationHist = inv.valuationHistory.map(vals => {
      return {
        ...vals,
        nav: vals.nav ? formatBigNumber(vals.nav, 18, 3) : 0,
        gav: vals.gav ? formatBigNumber(vals.gav) : 0,
      };
    });
    return {
      ...inv,
      valuationHistory: valuationHist,
      maxValuation: Math.max(...valuationHist.map(item => item.nav), 0),
      investedAmount: inv.history.reduce((carry, item) => {
        if (item.action === 'Investment') {
          return new BigNumber(carry).plus(new BigNumber(item.amountInDenominationAsset));
        } else {
          return new BigNumber(carry);
        }
      }, new BigNumber(0)),
      redeemedAmount: inv.history.reduce((carry, item) => {
        if (item.action === 'Redemption') {
          return new BigNumber(carry).plus(new BigNumber(item.amountInDenominationAsset));
        } else {
          return new BigNumber(carry);
        }
      }, new BigNumber(0)),
      xirr: robustIRR(prepareCashFlows(inv.history, inv.nav)),
    };
  });

  const valuationHistory =
    result.data &&
    result.data.investor &&
    result.data.investor.valuationHistory.map(valuation => {
      return {
        ...valuation,
        nav: valuation.nav ? formatBigNumber(valuation.nav, 18, 3) : 0,
        gav: valuation.gav ? formatBigNumber(valuation.gav, 18, 3) : 0,
      };
    });

  const maxValuation = valuationHistory && Math.max(...valuationHistory.map(item => item.nav), 0);

  const investmentHistory = (investor && investor.investmentHistory) || [];

  const investmentRequests = ((investor && investor.investmentRequests) || [])
    .filter(item => item.status === 'PENDING')
    .map(item => {
      let expires = parseInt(item.requestTimestamp, 10) + 24 * 60 * 60;
      let status = item.status;
      if (new Date().getTime() > new Date(expires).getTime()) {
        status = 'EXPIRED';
        expires = undefined;
      }
      return {
        ...item,
        status,
        expires,
      };
    });

  return (
    <Layout title="Investor">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Investor information</Typography>
          {investor && (
            <>
              <div>Address: {investor.id}</div>
            </>
          )}
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={12} md={12}>
        <InvestmentList investments={investments} loading={result.loading} />
      </Grid>

      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">All assets</Typography>
          <TimeSeriesChart data={valuationHistory} dataKeys={['nav']} yMax={maxValuation} />
        </Paper>
      </Grid>

      {investments &&
        investments.map(item => (
          <Grid item={true} xs={12} sm={6} md={6} key={item.id}>
            <Paper className={props.classes.paper}>
              <Typography variant="h6">{item.fund && item.fund.name}</Typography>
              <TimeSeriesChart data={item.valuationHistory} dataKeys={['nav']} yMax={item.maxValuation} />
            </Paper>
          </Grid>
        ))}

      <Grid item={true} xs={12}>
        <InvestorActivity activity={investmentHistory} loading={result.loading} />
      </Grid>
      {investmentRequests && (
        <Grid item={true} xs={12}>
          <NoSsr>
            <MaterialTable
              columns={[
                {
                  title: 'Date',
                  render: rowData => {
                    return formatDate(rowData.requestTimestamp, true);
                  },
                },
                {
                  title: 'Fund',
                  field: 'fund.name',
                },
                {
                  title: 'Shares',
                  render: rowData => {
                    return formatBigNumber(rowData.shares, 18, 3);
                  },
                  type: 'numeric',
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
                  field: 'asset.symbol',
                },
                {
                  title: 'Status',
                  field: 'status',
                },
                {
                  title: 'Expires',
                  render: rowData => {
                    return rowData.expires && formatDate(rowData.expires, true);
                  },
                },
              ]}
              data={investmentRequests}
              title="Pending investments"
              options={{
                paging: false,
                search: false,
              }}
              isLoading={result.loading}
              onRowClick={(_, rowData) => {
                const url = '/fund?address=' + rowData.fund.id;
                window.open(url, '_self');
              }}
            />
          </NoSsr>
        </Grid>
      )}
    </Layout>
  );
};

export default withStyles(styles)(Investor);
