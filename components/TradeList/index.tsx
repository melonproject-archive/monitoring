import React from 'react';
import * as R from 'ramda';
import MaterialTable from 'material-table';

import { withStyles } from '@material-ui/styles';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';
import { methodSigToName } from '~/utils/methodSigToName';
import TooltipNumber from '../TooltipNumber';

export interface TradeListProps {
  data: any;
  hideFund?: boolean;
  hideExchange?: boolean;
  loading?: boolean;
  paging?: boolean;
  linkFile?: string;
  linkPath?: string[];
}

const styles = theme => ({
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
      cellStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Fund',
      field: 'trading.fund.name',
      hidden: props.hideFund,
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Maker asset',
      field: 'orderAddress2.symbol',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Taker asset',
      field: 'orderAddress3.symbol',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Maker asset qty',
      render: rowData => {
        return (
          <TooltipNumber
            number={rowData.orderValue0}
            decimals={(rowData.orderAddress2 && rowData.orderAddress2.decimals) || 18}
          />
        );
      },
      customSort: (a, b) => sortBigNumber(a, b, 'orderValue0'),
      type: 'numeric',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Taker asset qty',
      render: rowData => {
        return (
          <TooltipNumber
            number={rowData.orderValue1}
            decimals={(rowData.orderAddress3 && rowData.orderAddress3.decimals) || 18}
          />
        );
      },
      customSort: (a, b) => sortBigNumber(a, b, 'orderValue1'),
      type: 'numeric',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Taker asset qty traded',
      render: rowData => {
        return (
          <TooltipNumber
            number={rowData.orderValue6}
            decimals={(rowData.orderAddress3 && rowData.orderAddress3.decimals) || 18}
          />
        );
      },
      customSort: (a, b) => sortBigNumber(a, b, 'orderValue6'),
      type: 'numeric',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Method Signature',
      render: rowData => {
        return methodSigToName(rowData.methodSignature);
      },
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
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
      title={'Trading activity on all exchanges'}
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
