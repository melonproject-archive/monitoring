import React from 'react';
import * as R from 'ramda';
import {
  Grid,
  withStyles,
  WithStyles,
  StyleRulesCallback,
  Typography,
  CircularProgress,
  Paper,
} from '@material-ui/core';
import { FundCountQuery, MelonNetworkHistoryQuery } from '~/queries/FundListQuery';
import Layout from '~/components/Layout';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import TSAreaChart from '~/components/TSAreaChart';
import { InvestorCountQuery } from '~/queries/InvestorListQuery';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

type NetworkProps = WithStyles<typeof styles>;

const Network: React.FunctionComponent<NetworkProps> = props => {
  const result = useScrapingQuery([FundCountQuery, FundCountQuery], proceedPaths(['fundCounts']), {
    ssr: false,
  });

  const fundCounts = R.pathOr([], ['data', 'fundCounts'], result);

  const historyResult = useScrapingQuery(
    [MelonNetworkHistoryQuery, MelonNetworkHistoryQuery],
    proceedPaths(['melonNetworkHistories']),
    {
      ssr: false,
    },
  );

  const melonNetworkHistories = R.pathOr([], ['data', 'melonNetworkHistories'], historyResult)
    .filter(item => item.validGav)
    .map(item => {
      return {
        ...item,
        gav: formatBigNumber(item.gav, 18, 0),
      };
    });

  const investorResult = useScrapingQuery([InvestorCountQuery, InvestorCountQuery], proceedPaths(['investorCounts']), {
    ssr: false,
  });

  const investorCounts = R.pathOr([], ['data', 'investorCounts'], investorResult);

  return (
    <Layout title="Network overview" page="/">
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5" component="h2">
            Number of funds
          </Typography>
          {(result.loading && <CircularProgress />) || (
            <>
              <br />
              <Typography variant="body1">
                {fundCounts &&
                  parseInt(fundCounts[fundCounts.length - 1].active, 10) +
                    parseInt(fundCounts[fundCounts.length - 1].nonActive, 10)}{' '}
                funds ({fundCounts[fundCounts.length - 1].active} active,{' '}
                {fundCounts && fundCounts[fundCounts.length - 1].nonActive} not active)
              </Typography>
              <br />
              <TSAreaChart data={fundCounts} dataKeys={['active', 'nonActive']} />
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5" component="h2">
            Total assets under management
          </Typography>
          {(historyResult.loading && <CircularProgress />) || (
            <>
              <br />
              <Typography variant="body1">
                {melonNetworkHistories && melonNetworkHistories[melonNetworkHistories.length - 1].gav} ETH
              </Typography>
              <br />
              <TSAreaChart data={melonNetworkHistories} dataKeys={['gav']} />
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Investors</Typography>
          {(historyResult.loading && <CircularProgress />) || (
            <>
              <br />
              <Typography variant="body1">
                {investorCounts.length && investorCounts[investorCounts.length - 1].numberOfInvestors} investors
              </Typography>
              <br />
              <TSAreaChart data={investorCounts} dataKeys={['numberOfInvestors']} />
            </>
          )}
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Network);
