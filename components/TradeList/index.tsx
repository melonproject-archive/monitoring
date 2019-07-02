import React from 'react';
import * as R from 'ramda';
import MaterialTable from 'material-table';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';
import { methodSigToName } from '~/utils/methodSigToName';

export interface TradeListProps {
  data: any;
  hideFund?: boolean;
  hideExchange?: boolean;
  loading?: boolean;
  paging?: boolean;
  linkFile?: string;
  linkPath?: string[];
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
      hidden: props.hideFund,
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
        return formatBigNumber(rowData.orderValue0, (rowData.orderAddress2 && rowData.orderAddress2.decimals) || 18, 3);
      },
      customSort: (a, b) => sortBigNumber(a, b, 'orderValue0'),
      type: 'numeric',
    },
    {
      title: 'Taker asset qty',
      render: rowData => {
        return formatBigNumber(rowData.orderValue1, (rowData.orderAddress3 && rowData.orderAddress3.decimals) || 18, 3);
      },
      customSort: (a, b) => sortBigNumber(a, b, 'orderValue1'),
      type: 'numeric',
    },
    {
      title: 'Taker asset qty traded',
      render: rowData => {
        return formatBigNumber(rowData.orderValue6, (rowData.orderAddress3 && rowData.orderAddress3.decimals) || 18, 3);
      },
      customSort: (a, b) => sortBigNumber(a, b, 'orderValue6'),
      type: 'numeric',
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

  const linkFile = props.linkFile || 'fund';

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
        const url =
          '/' + linkFile + '?address=' + (props.linkPath ? R.path(props.linkPath, rowData) : rowData.trading.fund.id);
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(TradeList);
