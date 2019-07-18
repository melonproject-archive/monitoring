import React from 'react';
import * as R from 'ramda';
import {
  Grid,
  withStyles,
  WithStyles,
  StyleRulesCallback,
  Typography,
  NoSsr,
  Card,
  CardContent,
  CircularProgress,
} from '@material-ui/core';
import { FundCountQuery, MelonNetworkHistoryQuery } from '~/queries/FundListQuery';
import FundList from '~/components/FundList';
import Layout from '~/components/Layout';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import TSAreaChart from '~/components/TSAreaChart';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const Home: React.FunctionComponent<WithStyles<typeof styles>> = props => {
  const result = useScrapingQuery([FundCountQuery, FundCountQuery], proceedPaths(['fundCounts']), {
    ssr: false,
  });

  const fundCounts = R.pathOr([], ['data', 'fundCounts'], result);

  const loading = result.loading;

  const historyResult = useScrapingQuery(
    [MelonNetworkHistoryQuery, MelonNetworkHistoryQuery],
    proceedPaths(['melonNetworkHistories']),
    {
      ssr: false,
    },
  );

  const historyLoading = historyResult.loading;

  const melonNetworkHistories = R.pathOr([], ['data', 'melonNetworkHistories'], historyResult).map(item => {
    return {
      ...item,
      gav: formatBigNumber(item.gav, 18, 0),
    };
  });

  return (
    <Layout title="Funds">
      <Grid item={true} xs={12} sm={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Number of funds
            </Typography>
            {(loading && <CircularProgress />) || (
              <>
                <br />
                <Typography variant="body1">
                  {fundCounts &&
                    parseInt(fundCounts[fundCounts.length - 1].active, 10) +
                      parseInt(fundCounts[fundCounts.length - 1].nonActive, 10)}{' '}
                  funds ({fundCounts[fundCounts.length - 1].active} active,{' '}
                  {fundCounts && fundCounts[fundCounts.length - 1].nonActive} not active)
                </Typography>
                <TSAreaChart data={fundCounts} dataKeys={['active', 'nonActive']} />
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Total assets under management
            </Typography>
            {(historyLoading && <CircularProgress />) || (
              <>
                <br />
                <Typography variant="body1">
                  {melonNetworkHistories && melonNetworkHistories[melonNetworkHistories.length - 1].gav} ETH
                </Typography>
                <TSAreaChart data={melonNetworkHistories} dataKeys={['gav']} />
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <FundList />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Home);
