import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import * as Rx from 'rxjs';
import { Grid, withStyles, WithStyles, Card, CardContent, Typography, CircularProgress } from '@material-ui/core';
import { FundListQuery, FundCountQuery, MelonNetworkHistoryQuery } from '~/queries/FundListQuery';
import FundList from '~/components/FundList';
import Layout from '~/components/Layout';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { fetchSingleCoinApiRate } from '~/utils/coinApi';
import { formatThousands } from '~/utils/formatThousands';
import { delay, retryWhen } from 'rxjs/operators';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

const getUSDRate = () => {
  const [rate, setRate] = useState({ rate: 1 });

  useEffect(() => {
    const rates$ = Rx.defer(() => fetchSingleCoinApiRate()).pipe(retryWhen((error) => error.pipe(delay(10000))));
    const subscription = rates$.subscribe({
      next: (result) => setRate(result),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return rate;
};

type HomeProps = WithStyles<typeof styles>;

const Home: React.FunctionComponent<HomeProps> = (props) => {
  const rate = getUSDRate();

  const fundListResult = useScrapingQuery([FundListQuery, FundListQuery], proceedPaths(['funds']), {
    ssr: false,
  });

  const funds = R.pathOr([], ['data', 'funds'], fundListResult);

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

  const melonNetworkHistories = R.pathOr([], ['data', 'melonNetworkHistories'], historyResult)
    .filter((item) => item.gav > 0)
    .map((item) => {
      return {
        ...item,
        gav: formatBigNumber(item.gav, 18, 0),
      };
    });

  const ethAum = melonNetworkHistories.length && melonNetworkHistories[melonNetworkHistories.length - 1].gav;
  const usdAum = formatThousands((ethAum && ethAum * rate.rate).toFixed(0));

  return (
    <Layout title="Melon Funds" page="funds">
      <Grid item={true} xs={12} sm={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Number of funds
            </Typography>
            {(loading && <CircularProgress />) || (
              <>
                <br />
                <Typography variant="body1" align="right">
                  {fundCounts &&
                    parseInt(fundCounts[fundCounts.length - 1].active, 10) +
                      parseInt(fundCounts[fundCounts.length - 1].nonActive, 10)}{' '}
                  funds <br />({fundCounts[fundCounts.length - 1].active} active,{' '}
                  {fundCounts && fundCounts[fundCounts.length - 1].nonActive} not active)
                </Typography>
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
                <Typography variant="body1" align="right">
                  {ethAum} ETH
                  <br />
                  {usdAum} USD
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <Card>
          <CardContent>
            <Typography variant="body1">
              To set up a fund on the melon network or to invest into a fund, please visit{' '}
              <a href="https://melon.avantgarde.finance/" className={props.classes.aStyle}>
                https://melon.avantgarde.finance/
              </a>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <FundList data={funds} loading={fundListResult.loading} ethusd={rate.rate} />
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Home);
