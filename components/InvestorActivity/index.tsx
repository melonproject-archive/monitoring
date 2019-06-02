import React from 'react';
import MaterialTable, { Column } from 'material-table';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { formatDate } from '~/utils/formatDate';

export interface InvestorActivityProps {
  activity: any;
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
    render: rowData => {
      return rowData.action.charAt(0).toUpperCase() + rowData.action.slice(1);
    },
  },
  {
    title: 'Shares',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.shares);
    },
  },
  {
    title: 'Share Price',
    type: 'numeric',
    render: rowData => {
      return rowData.sharePrice ? formatBigNumber(rowData.sharePrice) : '';
    },
  },
  {
    title: 'Amount [ETH]',
    type: 'numeric',
    render: rowData => {
      return rowData.amount ? formatBigNumber(rowData.amount) : '';
    },
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
      onRowClick={(_, rowData) => {
        const url = '/fund?address=' + rowData.fund.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(InvestorActivity);
