import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import InvestorDetailsQuery from '~/queries/InvestorDetailsQuery';
import Layout from '~/components/Layout';
import TimeSeriesChart from '~/components/TimeSeriesChart';
import { formatBigNumber } from '~/utils/formatBigNumber';
import InvestmentList from '~/components/InvestmentList';
import InvestorActivity from '~/components/InvestorActivity';

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

  const investor = R.pathOr(undefined, ['data', 'investor'], result);
  const investments = R.pathOr([], ['data', 'investor', 'investments'], result).map(inv => {
    return {
      ...inv,
      valuationHistory: inv.valuationHistory.map(vals => {
        return {
          ...vals,
          nav: vals.nav ? formatBigNumber(vals.nav) : 0,
          gav: vals.gav ? formatBigNumber(vals.gav) : 0,
        };
      }),
    };
  });

  const valuationHistory =
    result.data &&
    result.data.investor &&
    result.data.investor.valuationHistory.map(valuation => {
      return {
        ...valuation,
        nav: valuation.nav ? formatBigNumber(valuation.nav) : 0,
        gav: valuation.gav ? formatBigNumber(valuation.gav) : 0,
      };
    });

  const investmentHistory = (investor && investor.investmentHistory) || [];

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
        <InvestmentList investments={investments} />
      </Grid>

      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">All assets</Typography>
          <TimeSeriesChart data={valuationHistory} dataKeys={['gav']} />
        </Paper>
      </Grid>

      {investments &&
        investments.map(item => (
          <Grid item={true} xs={12} sm={6} md={6} key={item.id}>
            <Paper className={props.classes.paper}>
              <Typography variant="h6">{item.fund.name}</Typography>
              <TimeSeriesChart data={item.valuationHistory} dataKeys={['gav']} />
            </Paper>
          </Grid>
        ))}

      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <InvestorActivity activity={investmentHistory} />
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Investor);
