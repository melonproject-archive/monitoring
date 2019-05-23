import React from 'react';
import Link from 'next/link';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import FundOverviewQuery from '~/queries/FundOverviewQuery';
import { LineChart, AreaChart, Area, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import moment from 'moment';
import { toFixed, createToken, createQuantity } from '@melonproject/token-math';

const styles: StyleRulesCallback = theme => ({});

const Home: React.FunctionComponent<WithStyles<typeof styles>> = props => {
  const result = useQuery(FundOverviewQuery, {
    ssr: false,
  });

  const funds = (result.data && result.data.funds) || [];
  const fundCounts = (result.data && result.data.fundCounts) || [];

  const token = funds && createToken('WETH', undefined, 18);

  const aggregateValues =
    result.data &&
    result.data.aggregateValues &&
    result.data.aggregateValues.map(item => {
      return {
        timestamp: item.timestamp,
        gav: toFixed(createQuantity(token, item.gav)),
      };
    });

  return (
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        <Link href={'/engine'}>
          <a>Engine</a>
        </Link>{' '}
        |
        <Link href={'/assets'}>
          <a>Assets</a>
        </Link>{' '}
        |
        <Link href={'/investors'}>
          <a>Investors</a>
        </Link>
      </Grid>
      <Grid item={true} xs={12}>
        <Typography variant="h4">Total assets under management</Typography>
        <ResponsiveContainer height={200} width="80%">
          <LineChart width={400} height={400} data={aggregateValues}>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
            />
            <YAxis domain={[0, 150]} />
            <Line type="monotone" dataKey="gav" stroke="#8884d8" dot={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item={true} xs={12}>
        <Typography variant="h4">Number of Funds</Typography>
        <ResponsiveContainer height={200} width="80%">
          <AreaChart width={400} height={400} data={fundCounts}>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
            />
            <YAxis domain={[0, 30]} />
            <Area type="stepAfter" dataKey="active" stroke="#8884d8" />
            <Area type="stepAfter" dataKey="nonActive" stroke="#aaaaaa" />
            <Tooltip />
          </AreaChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item={true} xs={12}>
        <Typography variant="h4">Fund List</Typography>
        {funds.map(item => (
          <div key={item.id}>
            <Link href={`/fund?address=${item.id}`}>
              <a>{item.name}</a>
            </Link>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Home);
