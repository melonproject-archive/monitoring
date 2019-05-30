import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { InvestorCountQuery } from '~/queries/InvestorsQuery';

import Layout from '~/components/Layout';
import TimeSeriesChart from '~/components/TimeSeriesChart';
import InvestorList from '~/components/InvestorList';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type InvestorsProps = WithStyles<typeof styles>;

const Investors: React.FunctionComponent<InvestorsProps> = props => {
  const result = useQuery(InvestorCountQuery, {
    ssr: false,
  });

  const investorCounts = (result.data && result.data.investorCounts) || [];

  return (
    <Layout title="Investors">
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Number of investors</Typography>
          <TimeSeriesChart data={investorCounts} dataKeys={['numberOfInvestors']} yMax="100" />
        </Paper>
      </Grid>
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <InvestorList />
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Investors);
