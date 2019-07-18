import React from 'react';
import MaterialTable from 'material-table';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback, Tooltip } from '@material-ui/core';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { useQuery } from '@apollo/react-hooks';
import { AssetListQuery } from '~/queries/AssetListQuery';
import { sortBigNumber } from '~/utils/sortBigNumber';

export interface AssetListProps {
  data?: any;
}

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns = [
  {
    title: 'Symbol',
    field: 'symbol',
  },
  {
    title: 'Name',
    field: 'name',
  },
  {
    title: 'Last price',
    render: rowData => {
      return formatBigNumber(rowData.lastPrice, 18, 6);
    },
    type: 'numeric',
    customSort: (a, b) => sortBigNumber(a, b, 'lastPrice'),
  },
  {
    title: '# funds',
    field: 'numberOfFunds.length',
    type: 'numeric',
  },
  {
    title: 'Aggregate amount',
    type: 'numeric',
    render: rowData => {
      return (
        <Tooltip title={formatBigNumber(rowData.aggregateAmount, 18, 18)}>
          <span>{formatBigNumber(rowData.aggregateAmount, 18, 4)}</span>
        </Tooltip>
      );
    },
    customSort: (a, b) => sortBigNumber(a, b, 'aggregateAmount'),
  },
  {
    title: 'Aggregate amount in ETH',
    type: 'numeric',
    defaultSort: 'desc',
    render: rowData => {
      return (
        <Tooltip title={formatBigNumber(rowData.aggregateAmountInEth, 18, 18)}>
          <span>{formatBigNumber(rowData.aggregateAmountInEth, 18, 4)}</span>
        </Tooltip>
      );
    },
    customSort: (a, b) => sortBigNumber(a, b, 'aggregateAmountInEth'),
  },
];

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

  return (
    <MaterialTable
      columns={columns as any}
      data={assets}
      title="Assets"
      options={{
        paging: false,
      }}
      isLoading={result.loading}
      onRowClick={(_, rowData) => {
        const url = '/asset?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(AssetList);
