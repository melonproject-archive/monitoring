import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { InvestorCountQuery } from '~/queries/InvestorListQuery';

import Layout from '~/components/Layout';
import TimeSeriesChart from '~/components/TimeSeriesChart';
import InvestorList from '~/components/InvestorList';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type InvestorsProps = WithStyles<typeof styles>;

const Investors: React.FunctionComponent<InvestorsProps> = props => {
  const result = useScrapingQuery([InvestorCountQuery, InvestorCountQuery], proceedPaths(['investorCounts']), {
    ssr: false,
  });

  const investorCounts = (result.data && result.data.investorCounts) || [];

  return (
    <Layout title="Investors">
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Total number of investments into Melon funds</Typography>
          <TimeSeriesChart data={investorCounts} dataKeys={['numberOfInvestors']} yMax={100} loading={result.loading} />
        </Paper>
      </Grid>
      <Grid item={true} xs={12}>
        <InvestorList />
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Investors);
