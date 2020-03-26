import React from 'react';
import MaterialTable, { Column } from 'material-table';

import { withStyles } from '@material-ui/styles';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';
import TooltipNumber from '../TooltipNumber';

export interface InvestorActivityProps {
  activity: any;
  loading: any;
}

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns: Array<Column<any>> = [
  {
    title: 'Date',
    render: (rowData) => {
      return formatDate(rowData.timestamp, true);
    },
    defaultSort: 'asc',
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Fund',
    field: 'fund.name',
    defaultSort: 'asc',
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Activity',
    field: 'action',
  },
  {
    title: 'Shares',
    type: 'numeric',
    render: (rowData) => {
      return <TooltipNumber number={rowData.shares} />;
    },
    customSort: (a, b) => sortBigNumber(a, b, 'shares'),
  },
  {
    title: 'Share Price',
    type: 'numeric',
    render: (rowData) => {
      return <TooltipNumber number={rowData.sharePrice} />;
    },
    customSort: (a, b) => sortBigNumber(a, b, 'sharePrice'),
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
    render: (rowData) => {
      if (rowData.action === 'Redemption') {
        return '';
      }
      return <TooltipNumber number={rowData.amount} decimals={rowData.asset.decimals} />;
    },
  },
  {
    title: 'Asset',
    render: (rowData: any) => {
      if (rowData.action === 'Redemption') {
        return '(in kind)';
      }
      return rowData.asset.symbol;
    },
  },
  {
    title: 'Amount [ETH]',
    type: 'numeric',
    render: (rowData) => {
      return <TooltipNumber number={rowData.amountInDenominationAsset} />;
    },
    customSort: (a, b) => sortBigNumber(a, b, 'amountInDenominationAsset'),
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
];

const InvestorActivity: React.FunctionComponent<InvestorActivityProps> = (props) => {
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
