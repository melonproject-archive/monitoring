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
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import FundList from '~/components/FundList';
import Layout from '~/components/Layout';
import { formatDate } from '~/utils/formatDate';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const Home: React.FunctionComponent<WithStyles<typeof styles>> = props => {
  const result = useScrapingQuery([FundCountQuery, FundCountQuery], proceedPaths(['fundCounts']), {
    ssr: false,
  });

  const fundCounts = (result.data && result.data.fundCounts) || [];
  const loading = result.loading;

  const maxFunds = Math.max(...fundCounts.map(item => parseInt(item.active, 10) + parseInt(item.nonActive, 10), 0));

  const historyResult = useScrapingQuery(
    [MelonNetworkHistoryQuery, MelonNetworkHistoryQuery],
    proceedPaths(['melonNetworkHistories']),
    {
      ssr: false,
    },
  );

  const melonNetworkHistories = R.pathOr([], ['data', 'melonNetworkHistories'], historyResult).map(item => {
    return {
      ...item,
      gav: formatBigNumber(item.gav, 18, 0),
    };
  });

  const maxGav = Math.max(...melonNetworkHistories.map(item => item.gav), 0);

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
                <ResponsiveContainer height={200} width="100%">
                  <AreaChart data={fundCounts}>
                    <XAxis
                      dataKey="timestamp"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={timeStr => formatDate(timeStr)}
                      stroke="#dddddd"
                    />
                    <YAxis domain={[0, maxFunds]} orientation="right" stroke="#dddddd" />
                    <Area type="monotone" dataKey="nonActive" stackId="1" stroke="#87cefa" fill="#87cefa" />
                    <Area type="monotone" dataKey="active" stackId="1" stroke="#00bfff" fill="#00bfff" />
                    <Tooltip
                      labelFormatter={value => `Date: ${formatDate(value)}`}
                      contentStyle={{ backgroundColor: '#4A4A4A' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
            {(loading && <CircularProgress />) || (
              <>
                <br />
                <Typography variant="body1">
                  {melonNetworkHistories && melonNetworkHistories[melonNetworkHistories.length - 1].gav} ETH
                </Typography>
                <ResponsiveContainer height={200} width="100%">
                  <AreaChart data={melonNetworkHistories}>
                    <XAxis
                      dataKey="timestamp"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={timeStr => formatDate(timeStr)}
                      stroke="#dddddd"
                    />
                    <YAxis domain={[0, maxGav]} orientation="right" stroke="#dddddd" />
                    <Area type="monotone" dataKey="gav" stroke="#00bfff" fill="#00bfff" dot={false} />
                    <Tooltip
                      labelFormatter={value => `Date: ${formatDate(value)}`}
                      formatter={value => [`${value} ETH`, 'Total assets']}
                      contentStyle={{ backgroundColor: '#4A4A4A' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
