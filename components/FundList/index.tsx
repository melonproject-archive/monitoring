import React from 'react';
import { Fund } from '~/types';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';

import BigNumber from 'bignumber.js';
import { withStyles } from '@material-ui/styles';

export interface FundListProps {
  funds: Fund[];
}

const styles = theme => ({});

const columns = [
  {
    title: 'Name',
    field: 'name',
  },
  {
    title: 'Creation date',
    render: rowData => {
      return formatDate(rowData.creationTime);
    },
  },
  {
    title: 'Investments',
    field: 'investments.length',
    type: 'numeric',
  },
  {
    title: 'AUM [ETH]',
    type: 'numeric',
    render: rowData => {
      return new BigNumber(rowData.gav).div(new BigNumber('1e18')).toFixed(3);
    },
    customSort: (a, b) => {
      return new BigNumber(a.gav).isGreaterThan(new BigNumber(b.gav))
        ? 1
        : new BigNumber(b.gav).isGreaterThan(new BigNumber(a.gav))
        ? -1
        : 0;
    },
  },
  {
    title: 'Share price',
    type: 'numeric',
    render: rowData => {
      return new BigNumber(rowData.sharePrice).div(new BigNumber('1e18')).toFixed(3);
    },
    customSort: (a, b) => {
      return new BigNumber(a.sharePrice).isGreaterThan(new BigNumber(b.sharePrice))
        ? 1
        : new BigNumber(b.sharePrice).isGreaterThan(new BigNumber(a.sharePrice))
        ? -1
        : 0;
    },
    defaultSort: 'desc',
  },
  {
    title: 'Number of shares',
    type: 'numeric',
    render: rowData => {
      return new BigNumber(rowData.totalSupply).div(new BigNumber('1e18')).toFixed(3);
    },
    customSort: (a, b) => {
      return new BigNumber(a.totalSupply).isGreaterThan(new BigNumber(b.totalSupply))
        ? 1
        : new BigNumber(b.totalSupply).isGreaterThan(new BigNumber(a.totalSupply))
        ? -1
        : 0;
    },
  },
  {
    title: 'Status',
    render: rowData => {
      return rowData.isShutdown ? 'Not active' : 'Active';
    },
    customSort: (a, b) => {
      return a.isShutdown === b.isShutdown ? 0 : a.isShutdown ? 1 : -1;
    },
  },
];

const FundList: React.FunctionComponent<FundListProps> = props => {
  return (
    <MaterialTable
      columns={columns as any}
      data={props.funds}
      title="Funds"
      options={{
        paging: false,
      }}
      onRowClick={(_, rowData) => {
        const url = '/fund?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(FundList);
