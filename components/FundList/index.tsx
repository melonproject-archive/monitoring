import React from 'react';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { sortBigNumber } from '~/utils/sortBigNumber';
import TooltipNumber from '../TooltipNumber';

export interface FundListProps {
  data?: any;
  loading?: boolean;
}

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns = [
  {
    title: 'Name',
    field: 'name',
    cellStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Creation date',
    render: rowData => {
      return formatDate(rowData.createdAt, true);
    },
    customSort: (a, b) => sortBigNumber(a, b, 'createdAt'),
    cellStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Denomination',
    field: 'accounting.denominationAsset.symbol',
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
      return <TooltipNumber number={rowData.gav} />;
    },
    customSort: (a, b) => sortBigNumber(a, b, 'gav'),
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Share price',
    type: 'numeric',
    render: rowData => {
      return <TooltipNumber number={rowData.sharePrice} />;
    },
    customSort: (a, b) => sortBigNumber(a, b, 'sharePrice'),
    defaultSort: 'desc',
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: '# shares',
    type: 'numeric',
    render: rowData => {
      return <TooltipNumber number={rowData.totalSupply} />;
    },
    customSort: (a, b) => sortBigNumber(a, b, 'totalSupply'),
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Protocol',
    field: 'versionName',
    headerStyle: {
      whiteSpace: 'nowrap',
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
    cellStyle: {
      whiteSpace: 'nowrap',
    },
  },
];

const FundList: React.FunctionComponent<FundListProps> = props => {
  return (
    <MaterialTable
      columns={columns as any}
      data={props.data}
      title="Funds"
      options={{
        paging: false,
      }}
      isLoading={props.loading}
      onRowClick={(_, rowData) => {
        const url = '/fund?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(FundList);
