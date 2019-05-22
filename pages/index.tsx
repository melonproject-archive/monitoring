import React from 'react';
import Link from 'next/link';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Paper } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import FundOverviewQuery from '~/queries/FundOverviewQuery';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import moment from 'moment';

const styles: StyleRulesCallback = theme => ({});

const Home: React.FunctionComponent<WithStyles<typeof styles>> = props => {
  const result = useQuery(FundOverviewQuery, {
    ssr: false,
  });

  const funds = (result.data && result.data.funds) || [];
  const fundCounts = (result.data && result.data.fundCounts) || [];

  return (
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        <Link href="/engine">Engine</Link>
      </Grid>
      <Grid item={true} xs={12}>
        <Paper>
          <ResponsiveContainer height={200} width="80%">
            <AreaChart width={400} height={400} data={fundCounts}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis domain={[0, 30]} />
              <Area type="linear" dataKey="active" stroke="#8884d8" />
              <Area type="linear" dataKey="nonActive" stroke="#aaaaaa" />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={12}>
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
