import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import FundOverviewQuery from '~/queries/FundOverviewQuery';
import { LineChart, AreaChart, Area, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import moment from 'moment';
import { toFixed, createToken, createQuantity } from '@melonproject/token-math';
import FundList from '~/components/FundList';
import Navigation from '~/components/Navigation';

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
  const fundCounts = data.fundCounts || [];
  const funds = (data.funds || []).sort((a, b) => {
    return b.grossSharePrice - a.grossSharePrice;
  });

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
    <Grid container={true} spacing={2}>
      <Navigation />
      <Grid item={true} xs={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Total assets under management</Typography>
          <ResponsiveContainer height={200} width="100%">
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
        </Paper>
      </Grid>
      <Grid item={true} xs={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Total number of Funds</Typography>
          <ResponsiveContainer height={200} width="100%">
            <AreaChart width={400} height={400} data={fundCounts}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis domain={[0, 100]} />
              <Area type="stepAfter" dataKey="active" stroke="#8884d8" />
              <Area type="stepAfter" dataKey="nonActive" stroke="#aaaaaa" />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fund List</Typography>
          <FundList funds={funds} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Home);
