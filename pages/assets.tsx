import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Paper } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useQuery } from '@apollo/react-hooks';
import { AssetsQuery } from '~/queries/AssetsQuery';
import Layout from '~/components/Layout';
import { formatDate } from '~/utils/formatDate';
import { formatBigNumber } from '~/utils/formatBigNumber';
import Link from 'next/link';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type AssetProps = WithStyles<typeof styles>;

const Assets: React.FunctionComponent<AssetProps> = props => {
  const result = useQuery(AssetsQuery, {
    ssr: false,
  });

  const filtered = (result.data && result.data.assets) || [];

  const prices = filtered
    .map((asset: any) => {
      const history = (asset.priceHistory || []).map((update: any) => ({
        timestamp: update.timestamp,
        [asset.symbol]: formatBigNumber(update.price, asset.decimals),
      }));

      return history;
    })
    .reduce((carry, current) => carry.concat(current), []);

  // const assets = filtered.map((asset: any) => asset.symbol);
  const grouped = Object.values(R.groupBy(value => value.timestamp, prices)).map(group => R.mergeAll(group));

  return (
    <Layout title="Asset Universe">
      {filtered.map(item => (
        <Grid item={true} xs={12} sm={12} md={12} key={item.id}>
          <Paper className={props.classes.paper}>
            <Grid container={true}>
              <Grid item={true} xs={12} sm={6} md={6}>
                <Link href={`/asset?address=${item.id}`}>
                  <a>{item.symbol}</a>
                </Link>
                <div>
                  <br />
                  {item.id}
                </div>
              </Grid>
              <Grid item={true} xs={12} sm={6} md={6}>
                <ResponsiveContainer height={100} width="100%">
                  <LineChart data={grouped}>
                    <XAxis
                      dataKey="timestamp"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={timeStr => formatDate(timeStr)}
                    />
                    <YAxis />
                    <Line key={item.symbol} type="monotone" dataKey={item.symbol} dot={false} />;
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Layout>
  );
};

export default withStyles(styles)(Assets);
