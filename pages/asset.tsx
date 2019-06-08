import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import AssetDetailsQuery from '~/queries/AssetDetailsQuery';
import { createToken, toFixed, createQuantity } from '@melonproject/token-math';
import Layout from '~/components/Layout';
import TimeSeriesChart from '~/components/TimeSeriesChart';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type AssetProps = WithStyles<typeof styles>;

const Asset: React.FunctionComponent<AssetProps> = props => {
  const router = useRouter();
  const result = useQuery(AssetDetailsQuery, {
    ssr: false,
    skip: !(router && router.query.address),
    variables: {
      asset: router && router.query.address,
    },
  });

  const asset = result.data && result.data.asset;

  const token = asset && createToken(asset.symbol, undefined, asset.decimals);

  const priceHistory =
    asset &&
    asset.priceHistory.map(item => {
      return {
        timestamp: item.timestamp,
        price: item.price > 0 ? toFixed(createQuantity(token, item.price)) : undefined,
      };
    });

  return (
    <Layout title="Assets">
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">{asset && asset.symbol}</Typography>

          {asset && (
            <>
              <div>Address: {asset && asset.id}</div>
              <div>Decimals: {asset && asset.decimals}</div>
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Asset price</Typography>
          <TimeSeriesChart data={priceHistory} dataKeys={['price']} />
        </Paper>
      </Grid>
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Asset price change</Typography>
          <Typography variant="body2">(todo - chart)</Typography>
        </Paper>
      </Grid>
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Aggregate value of {asset && asset.symbol} within Melon network</Typography>
          <Typography variant="body2">(todo - chart)</Typography>
        </Paper>
      </Grid>
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Funds with {asset && asset.symbol} in their portfolio</Typography>
          <Typography variant="body2">(todo - table)</Typography>
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Asset);
