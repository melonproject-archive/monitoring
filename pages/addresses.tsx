import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper, Link } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';
import { AssetsQuery } from '~/queries/AssetsQuery';
import { createToken, toFixed, createQuantity } from '@melonproject/token-math';
import Layout from '~/components/Layout';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type AddressesProps = WithStyles<typeof styles>;

const Addresses: React.FunctionComponent<AddressesProps> = props => {
  const result = useQuery(AssetsQuery, {
    ssr: false,
  });

  const filtered = (result.data && result.data.assets) || [];

  const prices = filtered
    .map((asset: any) => {
      const token = createToken(asset.symbol, undefined, 18);
      const updates = (asset.priceUpdates || []).map((update: any) => ({
        timestamp: update.timestamp,
        [asset.symbol]: toFixed(createQuantity(token, update.price)),
      }));

      return updates;
    })
    .reduce((carry, current) => carry.concat(current), []);

  const assets = filtered.map((asset: any) => asset.symbol);
  const grouped = Object.values(R.groupBy(value => value.timestamp, prices)).map(group => R.mergeAll(group));

  return (
    <Layout title="Asset Universe">
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Asset prices</Typography>
          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={grouped}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis />
              {assets.map(symbol => {
                const stroke = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

                return <Line key={symbol} type="monotone" dataKey={symbol} stroke={stroke} dot={false} />;
              })}
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Asset list</Typography>

          {filtered.map(item => (
            <div key={item.id}>
              <Link href={`/asset?address=${item.id}`}>
                <a>{item.symbol}</a>
              </Link>{' '}
              ({item.id})
            </div>
          ))}
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Addresses);
