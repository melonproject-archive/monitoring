import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper, NoSsr } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import AssetDetailsQuery from '~/queries/AssetDetailsQuery';
import { createToken, toFixed, createQuantity } from '@melonproject/token-math';
import Layout from '~/components/Layout';
import TimeSeriesChart from '~/components/TimeSeriesChart';
import MaterialTable from 'material-table';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { sortBigNumber } from '~/utils/sortBigNumber';

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
    asset.priceHistory.map((item, index, array) => {
      const timeSpan = index > 0 ? item.timestamp - array[index - 1].timestamp : 0;
      const returnSinceLastPriceUpdate = index > 0 ? item.price / array[index - 1].price - 1 : 0;
      const dailyReturn = index > 0 ? Math.pow(1 + returnSinceLastPriceUpdate, (24 * 60 * 60) / timeSpan) - 1 : 0;
      return {
        timestamp: item.timestamp,
        price: item.price > 0 ? toFixed(createQuantity(token, item.price)) : undefined,
        dailyReturn: index > 0 ? dailyReturn : 0,
      };
    });

  const networkValues =
    asset &&
    asset.melonNetworkAssetHistory.map(item => {
      return {
        timestamp: item.timestamp,
        amount: item.amount > 0 ? toFixed(createQuantity(token, item.amount)) : undefined,
      };
    });

  const maxValue = networkValues && Math.max(...networkValues.map(item => item.amount, 0));

  const funds =
    asset &&
    asset.fundAccountings
      .filter(fa => fa.fund)
      .map(fa => {
        return { ...fa.fund };
      })
      .map(fund => {
        return {
          ...fund,
          assetValue: fund.holdingsHistory.find(item => {
            return item.asset.id === router.query.address;
          }) || { amount: 0 },
        };
      })
      .filter(fund => fund.assetValue.amount > 0);

  return (
    <Layout title="Assets">
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">
            {asset && asset.symbol} - {asset && asset.name}
          </Typography>

          {asset && (
            <>
              <div>Address: {asset && asset.id}</div>
              <div>Decimals: {asset && asset.decimals}</div>
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Asset price</Typography>
          <TimeSeriesChart data={priceHistory} dataKeys={['price']} />
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Asset price change</Typography>
          <TimeSeriesChart data={priceHistory} dataKeys={['dailyReturn']} referenceLine={true} />{' '}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Aggregate value of {asset && asset.symbol} within Melon network</Typography>
          <TimeSeriesChart data={networkValues} dataKeys={['amount']} yMax={maxValue} />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Fund',
                field: 'name',
              },
              {
                title: 'Asset value',
                type: 'numeric',
                render: rowData => {
                  return formatBigNumber(rowData.assetValue.amount, 18, 3);
                },
                customSort: (a, b) => sortBigNumber(a, b, ['assetValue', 'amount']),
              },
              {
                title: 'Asset value in ETH',
                type: 'numeric',
                render: rowData => {
                  return formatBigNumber(rowData.assetValue.assetGav, 18, 3);
                },
                defaultSort: 'desc',
                customSort: (a, b) => sortBigNumber(a, b, ['assetValue', 'assetGav']),
              },
            ]}
            data={funds}
            title={'Funds with ' + (asset && asset.symbol) + ' in their portfolio'}
            options={{
              paging: false,
              search: false,
            }}
            isLoading={result.loading}
            onRowClick={(_, rowData) => {
              const url = '/fund?address=' + rowData.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Asset);
