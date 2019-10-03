import React from 'react';
import MaterialTable from 'material-table';

import { withStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import { AssetListQuery } from '~/queries/AssetListQuery';
import { sortBigNumber } from '~/utils/sortBigNumber';
import TooltipNumber from '../TooltipNumber';

export interface AssetListProps {
  data?: any;
  rates?: any;
}

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const AssetList: React.FunctionComponent<AssetListProps> = props => {
  const result = useQuery(AssetListQuery, {
    ssr: false,
  });

  const data = result.data || {};

  const assets = ((data && data.assets) || []).map(asset => {
    return {
      ...asset,
      numberOfFunds: asset.fundAccountings.filter(fA => fA.fund),
      aggregateAmount: asset.melonNetworkAssetHistory && asset.melonNetworkAssetHistory[0].amount,
      aggregateAmountInEth: asset.melonNetworkAssetHistory && asset.melonNetworkAssetHistory[0].assetGav,
    };
  });

  const columns = [
    {
      title: 'Symbol',
      field: 'symbol',
    },
    {
      title: 'Name',
      field: 'name',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Last price (pricefeed)',
      render: rowData => {
        return <TooltipNumber number={rowData.lastPrice} />;
      },
      type: 'numeric',
      customSort: (a, b) => sortBigNumber(a, b, 'lastPrice'),
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Last price (CoinAPI)',
      render: rowData => {
        return props.rates.hasOwnProperty(rowData.symbol) ? (1 / props.rates[rowData.symbol].rate).toFixed(4) : '';
      },
      type: 'numeric',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: '# funds',
      field: 'numberOfFunds.length',
      type: 'numeric',
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
        return <TooltipNumber number={rowData.aggregateAmount} decimals={rowData.decimals} />;
      },
      customSort: (a, b) => sortBigNumber(a, b, 'aggregateAmount'),
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Amount in ETH',
      type: 'numeric',
      defaultSort: 'desc',
      render: rowData => {
        return <TooltipNumber number={rowData.aggregateAmountInEth} />;
      },
      customSort: (a, b) => sortBigNumber(a, b, 'aggregateAmountInEth'),
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
  ];

  return (
    <MaterialTable
      columns={columns as any}
      data={assets}
      title="Assets"
      options={{
        paging: false,
      }}
      isLoading={result.loading}
      onRowClick={(_, rowData: any) => {
        const url = '/asset?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(AssetList);
