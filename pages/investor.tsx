import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, Typography, Paper, NoSsr } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import {
  InvestorDetailsQuery,
  InvestmentValuationHistoryQuery,
  InvestorValuationHistoryQuery,
} from '~/queries/InvestorDetailsQuery';
import Layout from '~/components/Layout';
import { formatBigNumber } from '~/utils/formatBigNumber';
import InvestmentList from '~/components/InvestmentList';
import InvestorActivity from '~/components/InvestorActivity';
import BigNumber from 'bignumber.js';
import { robustIRR } from '~/utils/robustIRR';
import { prepareCashFlows } from '~/utils/prepareCashFlows';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';
import EtherscanLink from '~/components/EtherscanLink';
import TSLineChart from '~/components/TSLineChart';
import { moneyMultiple } from '~/utils/moneyMultiple';
import TooltipNumber from '~/components/TooltipNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type InvestorProps = WithStyles<typeof styles>;

const Investor: React.FunctionComponent<InvestorProps> = (props) => {
  const router = useRouter();
  const result = useQuery(InvestorDetailsQuery, {
    ssr: false,
    skip: !(router && router.query.address),
    variables: {
      investor: router && router.query.address,
    },
  });

  const investor = R.pathOr(undefined, ['data', 'investor'], result);
  const investmentList = R.pathOr([], ['data', 'investor', 'investments'], result);

  // valuation for invididual investments
  const investmentValuationHistoryResult = useScrapingQuery(
    [InvestmentValuationHistoryQuery, InvestmentValuationHistoryQuery],
    proceedPaths(['investmentValuationHistories']),
    {
      ssr: false,
      skip: !investmentList.length,
      variables: {
        ids: investmentList && investmentList.map((investment) => investment.id),
      },
    },
  );

  const investments = investmentList.map((inv) => {
    const valuationHist = R.pathOr([], ['data', 'investmentValuationHistories'], investmentValuationHistoryResult)
      .filter((h) => h.investment.id === inv.id)
      .map((vals) => {
        return {
          ...vals,
          nav: vals.nav ? formatBigNumber(vals.nav, 18, 3) : 0,
          gav: vals.gav ? formatBigNumber(vals.gav) : 0,
        };
      });
    const cashflows = prepareCashFlows(inv.history, inv.nav);
    return {
      ...inv,
      valuationHistory: valuationHist,
      maxValuation: Math.max(...valuationHist.map((item) => item.nav), 0),
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
      xirr: robustIRR(cashflows),
      multiple: moneyMultiple(cashflows),
    };
  });

  // valuation for investor as a whole
  const investorValuationHistoryResult = useScrapingQuery(
    [InvestorValuationHistoryQuery, InvestorValuationHistoryQuery],
    proceedPaths(['investorValuationHistories']),
    {
      ssr: false,
      skip: !(router && router.query.address),
      variables: {
        id: router && router.query.address,
      },
    },
  );

  const valuationHistory = R.pathOr([], ['data', 'investorValuationHistories'], investorValuationHistoryResult).map(
    (valuation) => {
      return {
        ...valuation,
        nav: valuation.nav ? formatBigNumber(valuation.nav, 18, 3) : 0,
        gav: valuation.gav ? formatBigNumber(valuation.gav, 18, 3) : 0,
      };
    },
  );

  const maxValuation = valuationHistory && Math.max(...valuationHistory.map((item) => item.nav), 0);

  const investmentHistory = (investor && investor.investmentHistory) || [];
  const investmentRequests = ((investor && investor.investmentRequests) || [])
    .filter((item) => item.status === 'PENDING')
    .map((item) => {
      let expires = parseInt(item.requestTimestamp, 10) + 24 * 60 * 60;
      let status = item.status;
      if (new Date().getTime() > new Date(expires * 1000).getTime()) {
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
    <Layout title="Investor" page="investor">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Investor information</Typography>
          {investor && (
            <>
              <div>
                Address: <EtherscanLink address={investor.id} />
              </div>
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
          <TSLineChart data={valuationHistory} dataKeys={['nav']} yMax={maxValuation} />
        </Paper>
      </Grid>

      {investments &&
        investments.map((item) => (
          <Grid item={true} xs={12} sm={12} md={6} key={item.id}>
            <Paper className={props.classes.paper}>
              <Typography variant="h6">{item.fund && item.fund.name}</Typography>
              <TSLineChart data={item.valuationHistory} dataKeys={['nav']} yMax={item.maxValuation} />
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
                  render: (rowData: any) => {
                    return formatDate(rowData.requestTimestamp, true);
                  },
                },
                {
                  title: 'Fund',
                  field: 'fund.name',
                },
                {
                  title: 'Shares',
                  render: (rowData) => <TooltipNumber number={rowData.shares} />,
                  type: 'numeric',
                },
                {
                  title: 'Amount',
                  render: (rowData) => <TooltipNumber number={rowData.amount} decimals={rowData.asset.decimals} />,
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
                  render: (rowData) => {
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
