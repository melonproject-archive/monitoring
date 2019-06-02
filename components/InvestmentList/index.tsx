import React from 'react';
import MaterialTable, { Column } from 'material-table';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { formatBigNumber } from '~/utils/formatBigNumber';

export interface InvestmentListProps {
  investments: any;
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
  },
  {
    title: 'Invested amount [ETH]',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.investedAmount, 18, 3);
    },
  },
  {
    title: 'Redeemed amount [ETH]',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.redeemedAmount, 18, 3);
    },
  },
  {
    title: 'Current Value [ETH]',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.nav, 18, 3);
    },
  },
  {
    title: 'Return [%]',
    type: 'numeric',
    render: rowData => {
      return '(todo)';
    },
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
      onRowClick={(_, rowData) => {
        const url = '/fund?address=' + rowData.fund.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(InvestmentList);
