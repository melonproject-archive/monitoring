import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { FundOverviewQuery, FundOverviewScrapingQuery } from '~/queries/FundOverviewQuery';
import { LineChart, AreaChart, Area, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { toFixed, createToken, createQuantity } from '@melonproject/token-math';
import FundList from '~/components/FundList';
import Layout from '~/components/Layout';
import { formatDate } from '~/utils/formatDate';
import { useScrapingQuery } from '~/utils/useScrapingQuery';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const Home: React.FunctionComponent<WithStyles<typeof styles>> = props => {
  const proceed = (current: any, expected: number) => {
    if (current.funds && current.funds.length === expected) {
      return true;
    }

    return false;
  };

  const result = useScrapingQuery([FundOverviewQuery, FundOverviewScrapingQuery], proceed, {
    ssr: false,
  });

  const data = result.data || {};
  const fundCounts = data.fundCounts || [];
  const funds = (data.funds || []).sort((a, b) => {
    return b.sharePrice - a.sharePrice;
  });

  const token = funds && createToken('WETH', undefined, 18);

  const networkValues =
    result.data &&
    result.data.networkValues &&
    result.data.networkValues.map(item => {
      return {
        ...item,
        gav: toFixed(createQuantity(token, item.gav)),
      };
    });

  return (
    <Layout title="Funds">
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Total assets under management</Typography>
          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={networkValues}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => formatDate(timeStr)}
              />
              <YAxis domain={[0, 200]} />
              <Line type="monotone" dataKey="gav" stroke="#8884d8" dot={false} />
              <Tooltip
                labelFormatter={value => `Date: ${formatDate(value)}`}
                formatter={value => [value, 'Total assets']}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Total number of Funds</Typography>
          <ResponsiveContainer height={200} width="100%">
            <AreaChart width={400} height={400} data={fundCounts}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => formatDate(timeStr)}
              />
              <YAxis domain={[0, 80]} />
              <Area type="stepAfter" dataKey="active" stroke="#8884d8" />
              <Area type="stepAfter" dataKey="nonActive" stroke="#aaaaaa" />
              <Tooltip labelFormatter={value => `Date: ${formatDate(value)}`} />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <FundList funds={funds} />
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Home);
