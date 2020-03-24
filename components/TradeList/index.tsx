import React from 'react';
import * as R from 'ramda';
import MaterialTable from 'material-table';

import { withStyles } from '@material-ui/styles';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';
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
      title: 'Asset bought',
      field: 'assetBought.symbol',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Asset sold',
      field: 'assetSold.symbol',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Asset bought',
      render: rowData => {
        return (
          <TooltipNumber
            number={rowData.amountBought}
            decimals={(rowData.assetBought && rowData.assetBought.decimals) || 18}
          />
        );
      },
      customSort: (a, b) => sortBigNumber(a, b, 'amountBought'),
      type: 'numeric',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Amount sold',
      render: rowData => {
        return (
          <TooltipNumber
            number={rowData.amountSold}
            decimals={(rowData.assetSold && rowData.assetSold.decimals) || 18}
          />
        );
      },
      customSort: (a, b) => sortBigNumber(a, b, 'amountSold'),
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
      field: 'methodName',
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
      onRowClick={(_, rowData: any) => {
        const url =
          '/' + linkFile + '?address=' + (props.linkPath ? R.path(props.linkPath, rowData) : rowData.trading.fund.id);
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(TradeList);
