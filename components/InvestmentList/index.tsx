import React from 'react';
import MaterialTable, { Column } from 'material-table';

import { withStyles } from '@material-ui/styles';
import { sortBigNumber } from '~/utils/sortBigNumber';
import TooltipNumber from '../TooltipNumber';

export interface InvestmentListProps {
  investments: any;
  loading: any;
}

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns: Column<any>[] = [
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
    title: 'Shares',
    type: 'numeric',
    render: (rowData) => {
      return <TooltipNumber number={rowData.shares} />;
    },
    customSort: (a, b) => sortBigNumber(a, b, 'shares'),
  },
  {
    title: 'Invested [ETH]',
    type: 'numeric',
    render: (rowData) => {
      return <TooltipNumber number={rowData.investedAmount} />;
    },
    customSort: (a, b) => sortBigNumber(a, b, 'investedAmount'),
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Redeemed [ETH]',
    type: 'numeric',
    render: (rowData) => {
      return <TooltipNumber number={rowData.redeemedAmount} />;
    },
    customSort: (a, b) => sortBigNumber(a, b, 'redeemedAmount'),
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Current Value [ETH]',
    type: 'numeric',
    render: (rowData) => {
      return <TooltipNumber number={rowData.nav} />;
    },
    customSort: (a, b) => sortBigNumber(a, b, 'nav'),
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Money multiple',
    type: 'numeric',
    field: 'multiple',
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'IRR [%]',
    type: 'numeric',
    field: 'xirr',
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
];

const InvestmentList: React.FunctionComponent<InvestmentListProps> = (props) => {
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
