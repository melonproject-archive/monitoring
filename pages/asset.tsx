import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, Typography, Paper, NoSsr } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import {
  AssetDetailsQuery,
  SingleAssetPriceHistoryQuery,
  MelonNetworkAssetHistoryQuery,
  AssetFundsQuery,
} from '~/queries/AssetDetailsQuery';
import Layout from '~/components/Layout';
import MaterialTable from 'material-table';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { sortBigNumber } from '~/utils/sortBigNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import EtherscanLink from '~/components/EtherscanLink';
import TooltipNumber from '~/components/TooltipNumber';
import LineItem from '~/components/LineItem';
import TSLineChart from '~/components/TSLineChart';
import { fetchCoinApiRates } from '~/utils/coinApi';

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type AssetProps = WithStyles<typeof styles>;

const getRates = () => {
  const [rates, setRates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetchCoinApiRates();
      setRates(r);
    };

    fetchData();
  }, []);
  return rates;
};

const Asset: React.FunctionComponent<AssetProps> = props => {
  const router = useRouter();
  const rates: any = getRates();

  const result = useQuery(AssetDetailsQuery, {
    ssr: false,
    skip: !(router && router.query.address),
    variables: {
      asset: router && router.query.address,
    },
  });

  const assetFundsResult = useScrapingQuery(
    [AssetFundsQuery, AssetFundsQuery],
    proceedPaths(['asset', 'fundAccountings']),
    {
      ssr: false,
    },
  );

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

  const asset = R.pathOr([], ['data', 'asset'], result) as any;

  const priceHistory = R.pathOr([], ['data', 'assetPriceHistories'], priceResult).map((item, index, array) => {
    const timeSpan = index > 0 ? item.timestamp - array[index - 1].timestamp : 0;
    const returnSinceLastPriceUpdate = index > 0 ? item.price / array[index - 1].price - 1 : 0;
    let dailyReturn = index > 0 ? Math.pow(1 + returnSinceLastPriceUpdate, (24 * 60 * 60) / timeSpan) - 1 : 0;
    if (dailyReturn > 100 || dailyReturn <= -1) {
      dailyReturn = undefined;
    }
    return {
      timestamp: item.timestamp,
      price: item.price > 0 ? formatBigNumber(item.price, item.decimals, 6) : undefined,
      dailyReturn: index > 0 ? (dailyReturn * 100).toFixed(2) : 0,
    };
  });

  const networkValues = R.pathOr([], ['data', 'melonNetworkAssetHistories'], melonNetworkResult).map(item => {
    return {
      timestamp: item.timestamp,
      amount: item.amount > 0 ? formatBigNumber(item.amount, item.asset.decimals, 3) : undefined,
    };
  });

  const funds = R.pathOr([], ['data', 'accountings'], assetFundsResult)
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
    <Layout title="Asset" page="asset">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">{asset && asset.symbol && asset.symbol + ' - ' + asset.name}&nbsp;</Typography>
          <br />
          <Grid container={true}>
            <LineItem name="Address">
              <EtherscanLink address={asset && asset.id} />
            </LineItem>
            <LineItem name="Decimals" linebreak={true}>
              {asset && asset.decimals}
            </LineItem>
            <LineItem name="Price (Pricefeed)">
              <TooltipNumber number={asset && asset.lastPrice} /> ETH
            </LineItem>
            <LineItem name="Price (CoinAPI)">
              {rates && asset && rates[asset.symbol] && (1 / rates[asset.symbol].rate).toFixed(4)} ETH
            </LineItem>
          </Grid>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Asset price</Typography>
          <TSLineChart data={priceHistory} dataKeys={['price']} loading={result.loading} />
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Amount</Typography>
          <TSLineChart data={networkValues} dataKeys={['amount']} loading={result.loading} />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Fund',
                field: 'name',
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Amount',
                type: 'numeric',
                render: rowData => {
                  return (
                    <TooltipNumber number={rowData.assetValue.amount} decimals={rowData.assetValue.asset.decimals} />
                  );
                },
                customSort: (a, b) => sortBigNumber(a, b, ['assetValue', 'amount']),
              },
              {
                title: 'Value in ETH',
                type: 'numeric',
                render: rowData => {
                  return <TooltipNumber number={rowData.assetValue.assetGav} />;
                },
                defaultSort: 'desc',
                customSort: (a, b) => sortBigNumber(a, b, ['assetValue', 'assetGav']),
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
            ]}
            data={funds}
            title={`Funds with ${asset && asset.symbol} in their portfolio`}
            options={{
              paging: true,
              pageSize: 10,
              search: true,
            }}
            isLoading={assetFundsResult.loading}
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
