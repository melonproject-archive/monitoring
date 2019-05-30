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
import { FundOverviewQuery } from '~/queries/FundOverviewQuery';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import FundList from '~/components/FundList';
import Layout from '~/components/Layout';
import { formatDate } from '~/utils/formatDate';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { useQuery } from '@apollo/react-hooks';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const Home: React.FunctionComponent<WithStyles<typeof styles>> = props => {
  const result = useQuery(FundOverviewQuery, {
    ssr: false,
  });

  const data = result.data || {};
  const loading = result.loading;
  const fundCounts = data.fundCounts || [];

  const networkValues = R.pathOr([], ['data', 'networkValues'], result).map(item => {
    return {
      ...item,
      gav: formatBigNumber(item.gav, 18, 3),
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
                  {parseInt(fundCounts[fundCounts.length - 1].active, 10) +
                    parseInt(fundCounts[fundCounts.length - 1].nonActive, 10)}{' '}
                  funds ({fundCounts[fundCounts.length - 1].active} active,{' '}
                  {fundCounts[fundCounts.length - 1].nonActive} not active)
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
                    <YAxis domain={[0, 80]} orientation="right" stroke="#dddddd" />
                    <Area type="monotone" dataKey="active" stroke="#aaaaaa" fill="#aaaaaa" />
                    <Area type="monotone" dataKey="nonActive" stroke="#eeeeee" fill="#eeeeee" />
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
                <Typography variant="body1">{networkValues[networkValues.length - 1].gav} ETH</Typography>
                <ResponsiveContainer height={200} width="100%">
                  <AreaChart data={networkValues}>
                    <XAxis
                      dataKey="timestamp"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={timeStr => formatDate(timeStr)}
                      stroke="#dddddd"
                    />
                    <YAxis domain={[0, 200]} orientation="right" stroke="#dddddd" />
                    <Area type="monotone" dataKey="gav" stroke="#aaaaaa" fill="#aaaaaa" dot={false} />
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
