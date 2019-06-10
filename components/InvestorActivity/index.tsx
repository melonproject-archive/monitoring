import React from 'react';
import MaterialTable, { Column } from 'material-table';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';

export interface InvestorActivityProps {
  activity: any;
  loading: any;
}

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns: Column[] = [
  {
    title: 'Date',
    render: rowData => {
      return formatDate(rowData.timestamp);
    },
    defaultSort: 'asc',
  },
  {
    title: 'Fund',
    field: 'fund.name',
    defaultSort: 'asc',
  },
  {
    title: 'Activity',
    field: 'action',
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
    title: 'Share Price',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.sharePrice, 18, 3);
    },
    customSort: (a, b) => sortBigNumber(a, b, 'sharePrice'),
  },
  {
    title: 'Amount [ETH]',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.amount, 18, 3);
    },
    customSort: (a, b) => sortBigNumber(a, b, 'amount'),
  },
];

const InvestorActivity: React.FunctionComponent<InvestorActivityProps> = props => {
  return (
    <MaterialTable
      columns={columns}
      data={props.activity}
      title="Activity"
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

export default withStyles(styles)(InvestorActivity);
