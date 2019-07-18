import React from 'react';
import MaterialTable, { Column } from 'material-table';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { sortBigNumber } from '~/utils/sortBigNumber';

export interface InvestmentListProps {
  investments: any;
  loading: any;
}

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns: Column[] = [
  {
    title: 'Fund',
    field: 'fund.name',
    defaultSort: 'asc',
  },
  {
    title: 'Shares',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.shares, 18, 3);
    },
    customSort: (a, b) => sortBigNumber(a, b, 'shares'),
  },
  {
    title: 'Invested amount [ETH]',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.investedAmount, 18, 3);
    },
    customSort: (a, b) => sortBigNumber(a, b, 'investedAmount'),
  },
  {
    title: 'Redeemed amount [ETH]',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.redeemedAmount, 18, 3);
    },
    customSort: (a, b) => sortBigNumber(a, b, 'redeemedAmount'),
  },
  {
    title: 'Current Value [ETH]',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.nav, 18, 3);
    },
    customSort: (a, b) => sortBigNumber(a, b, 'nav'),
  },
  {
    title: 'Money multiple',
    type: 'numeric',
    field: 'multiple',
  },
  {
    title: 'Annualized return [%]',
    type: 'numeric',
    field: 'xirr',
  },
];

const InvestmentList: React.FunctionComponent<InvestmentListProps> = props => {
  return (
    <MaterialTable
      columns={columns}
      data={props.investments}
      title="Investments"
      options={{
        paging: false,
        search: false,
      }}
      isLoading={props.loading}
      onRowClick={(_, rowData) => {
        const url = '/fund?address=' + rowData.fund.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(InvestmentList);
