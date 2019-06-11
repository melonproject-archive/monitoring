import React from 'react';
import MaterialTable from 'material-table';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';
import { methodSigToName } from '~/utils/methodSigToName';

export interface TradeListProps {
  data: any;
  hideExchange?: boolean;
  loading?: boolean;
  paging?: boolean;
}

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const TradeList: React.FunctionComponent<TradeListProps> = props => {
  const columns = [
    {
      title: 'Date',
      render: rowData => {
        return formatDate(rowData.timestamp, true);
      },
      customSort: (a, b) => sortBigNumber(a, b, 'timestamp'),
      defaultSort: 'desc',
    },
    {
      title: 'Fund',
      field: 'trading.fund.name',
    },
    {
      title: 'Maker asset',
      field: 'orderAddress2.symbol',
    },
    {
      title: 'Taker asset',
      field: 'orderAddress3.symbol',
    },
    {
      title: 'Maker asset qty',
      render: rowData => {
        return formatBigNumber(rowData.orderValue0, 18, 3);
      },
    },
    {
      title: 'Taker asset qty',
      render: rowData => {
        return formatBigNumber(rowData.orderValue1, 18, 3);
      },
    },
    {
      title: 'Taker asset qty traded',
      render: rowData => {
        return formatBigNumber(rowData.orderValue6, 18, 3);
      },
    },
    {
      title: 'Method Signature',
      render: rowData => {
        return methodSigToName(rowData.methodSignature);
      },
    },
    {
      title: 'Exchange',
      field: 'exchange.name',
      hidden: props.hideExchange,
    },
  ];

  return (
    <MaterialTable
      columns={columns as any}
      data={props.data}
      title={'Trading activity'}
      options={{
        paging: props.paging,
        pageSize: 20,
        search: true,
      }}
      isLoading={props.loading}
      onRowClick={(_, rowData) => {
        const url = '/fund?address=' + rowData.trading.fund.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(TradeList);
