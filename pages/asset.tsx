import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper, NoSsr } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import {
  AssetDetailsQuery,
  SingleAssetPriceHistoryQuery,
  MelonNetworkAssetHistoryQuery,
} from '~/queries/AssetDetailsQuery';
import Layout from '~/components/Layout';
import TimeSeriesChart from '~/components/TimeSeriesChart';
import MaterialTable from 'material-table';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { sortBigNumber } from '~/utils/sortBigNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import EtherscanLink from '~/components/EtherscanLink';

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

  const priceResult = useScrapingQuery(
    [SingleAssetPriceHistoryQuery, SingleAssetPriceHistoryQuery],
    proceedPaths(['assetPriceHistories']),
    {
      ssr: false,
      skip: !(router && router.query.address),
      variables: {
        asset: router && router.query.address,
      },
    },
  );

  const melonNetworkResult = useScrapingQuery(
    [MelonNetworkAssetHistoryQuery, MelonNetworkAssetHistoryQuery],
    proceedPaths(['melonNetworkAssetHistories']),
    {
      ssr: false,
      skip: !(router && router.query.address),
      variables: {
        asset: router && router.query.address,
      },
    },
  );

  const asset = result.data && result.data.asset;

  const priceHistory = R.pathOr([], ['data', 'assetPriceHistories'], priceResult).map((item, index, array) => {
    const timeSpan = index > 0 ? item.timestamp - array[index - 1].timestamp : 0;
    const returnSinceLastPriceUpdate = index > 0 ? item.price / array[index - 1].price - 1 : 0;
    let dailyReturn = index > 0 ? Math.pow(1 + returnSinceLastPriceUpdate, (24 * 60 * 60) / timeSpan) - 1 : 0;
    if (dailyReturn > 100 || dailyReturn <= -1) {
      dailyReturn = undefined;
    }
    return {
      timestamp: item.timestamp,
      price: item.price > 0 ? formatBigNumber(item.price) : undefined,
      dailyReturn: index > 0 ? dailyReturn : 0,
    };
  });

  const networkValues = R.pathOr([], ['data', 'melonNetworkAssetHistories'], melonNetworkResult).map(item => {
    return {
      timestamp: item.timestamp,
      amount: item.amount > 0 ? formatBigNumber(item.amount, item.asset.decimals, 3) : undefined,
    };
  });

  const maxValue = networkValues && Math.max(...networkValues.filter(item => item.amount).map(item => item.amount, 0));

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
      .filter(fund => fund.assetValue.amount);

  return (
    <Layout title="Assets">
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">{asset && asset.symbol + ' - ' + asset.name}&nbsp;</Typography>
          <div>
            Address: <EtherscanLink address={asset && asset.id} />
          </div>
          <div>Decimals: {asset && asset.decimals}</div>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Price in ETH</Typography>
          <TimeSeriesChart data={priceHistory} dataKeys={['price']} loading={result.loading} />
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Daily price change [%]</Typography>
          <TimeSeriesChart
            data={priceHistory}
            dataKeys={['dailyReturn']}
            referenceLine={true}
            loading={result.loading}
          />{' '}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Aggregate value of {asset && asset.symbol} within Melon network</Typography>
          <TimeSeriesChart data={networkValues} dataKeys={['amount']} yMax={maxValue} loading={result.loading} />
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
                title: 'Amount',
                type: 'numeric',
                render: rowData => {
                  return formatBigNumber(rowData.assetValue.amount, rowData.assetValue.asset.decimals, 3);
                },
                customSort: (a, b) => sortBigNumber(a, b, ['assetValue', 'amount']),
              },
              {
                title: 'Value in ETH',
                type: 'numeric',
                render: rowData => {
                  return formatBigNumber(rowData.assetValue.assetGav, 18, 3);
                },
                defaultSort: 'desc',
                customSort: (a, b) => sortBigNumber(a, b, ['assetValue', 'assetGav']),
              },
            ]}
            data={funds}
            title={asset && `Funds with ${asset.symbol} in their portfolio`}
            options={{
              paging: true,
              pageSize: 10,
              search: true,
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
