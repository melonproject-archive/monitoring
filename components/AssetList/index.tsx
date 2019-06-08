import React from 'react';
import MaterialTable from 'material-table';

import BigNumber from 'bignumber.js';
import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { useQuery } from '@apollo/react-hooks';
import { AssetListQuery } from '~/queries/AssetsQuery';

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
    title: 'URL',
    field: 'url',
  },
  {
    title: 'Last price',
    render: rowData => {
      return formatBigNumber(rowData.lastPrice, 18, 6);
    },
    type: 'numeric',
    customSort: (a, b) => {
      return new BigNumber(a.lastPrice).isGreaterThan(new BigNumber(b.lastPrice))
        ? 1
        : new BigNumber(b.lastPrice).isGreaterThan(new BigNumber(a.lastPrice))
        ? -1
        : 0;
    },
  },
  {
    title: 'Funds',
    field: 'investments.length',
    type: 'numeric',
  },
  {
    title: 'Aggregate holdings',
    type: 'numeric',
  },
  {
    title: 'Aggregate holdings in ETH',
    type: 'numeric',
    defaultSort: 'desc',
  },
];

const AssetList: React.FunctionComponent<AssetListProps> = props => {
  const result = useQuery(AssetListQuery, {
    ssr: false,
  });

  const data = result.data || {};

  const assets = data && data.assets;

  return (
    <MaterialTable
      columns={columns as any}
      data={assets}
      title="Assets"
      options={{
        paging: false,
      }}
      onRowClick={(_, rowData) => {
        const url = '/asset?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(AssetList);
