import React from 'react';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback, Tooltip, Typography } from '@material-ui/core';
import { sortBigNumber } from '~/utils/sortBigNumber';
import TooltipNumber from '../TooltipNumber';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { formatThousands } from '~/utils/formatThousands';
import BigNumber from 'bignumber.js';

export interface FundListProps {
  data?: any;
  loading?: boolean;
  ethusd?: number;
}

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  positiveChange: {
    color: '#ff0000',
  },
});

const FundList: React.FunctionComponent<FundListProps> = props => {
  const priceChange = (today, yesterday) => {
    const bnToday = new BigNumber(today);
    const bnYesterday = new BigNumber(yesterday);
    const color = bnToday.gt(bnYesterday) ? 'secondary' : bnToday.lt(bnYesterday) ? 'error' : 'primary';
    const prefix = bnToday.gt(bnYesterday) ? '+' : '';

    return (
      <Typography variant="body2" color={color}>
        {prefix}
        <TooltipNumber number={new BigNumber(today).minus(new BigNumber(yesterday)).toString()} />
      </Typography>
    );
  };

  const columns = [
    {
      title: 'Name',
      field: 'name',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Address',
      field: 'id',
      render: rowData => {
        return (
          <Tooltip title={rowData.id} placement="right">
            <span>{rowData.id.substr(0, 8)}...</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Inception',
      render: rowData => {
        return formatDate(rowData.createdAt, true);
      },
      customSort: (a, b) => sortBigNumber(a, b, 'createdAt'),
      cellStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'AUM [ETH]',
      type: 'numeric',
      render: rowData => {
        return <TooltipNumber number={rowData.gav} />;
      },
      customSort: (a, b) => sortBigNumber(a, b, 'gav'),
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'AUM [USD]',
      type: 'numeric',
      render: rowData => {
        return formatThousands((parseFloat(formatBigNumber(rowData.gav, 18, 18)) * (props.ethusd || 1)).toFixed(0));
      },
      customSort: (a, b) => sortBigNumber(a, b, 'gav'),
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Share price',
      type: 'numeric',
      render: rowData => {
        return <TooltipNumber number={rowData.sharePrice} />;
      },
      customSort: (a, b) => sortBigNumber(a, b, 'sharePrice'),
      defaultSort: 'desc',
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Change',
      render: rowData => {
        return priceChange(rowData.calculationsHistory[0].sharePrice, rowData.calculationsHistory[1].sharePrice);
      },
      customSort: (a, b) =>
        a.calculationsHistory[0].sharePrice -
        a.calculationsHistory[1].sharePrice -
        (b.calculationsHistory[0].sharePrice - b.calculationsHistory[1].sharePrice),
    },
    {
      title: '# shares',
      type: 'numeric',
      render: rowData => {
        return <TooltipNumber number={rowData.totalSupply} />;
      },
      customSort: (a, b) => sortBigNumber(a, b, 'totalSupply'),
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Denomination',
      field: 'accounting.denominationAsset.symbol',
    },
    {
      title: 'Investments',
      field: 'investments.length',
      type: 'numeric',
    },
    {
      title: 'Protocol',
      field: 'versionName',
      headerStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Status',
      render: rowData => {
        return rowData.isShutdown ? 'Not active' : 'Active';
      },
      customSort: (a, b) => {
        return a.isShutdown === b.isShutdown ? 0 : a.isShutdown ? 1 : -1;
      },
      cellStyle: {
        whiteSpace: 'nowrap',
      },
    },
  ];

  return (
    <MaterialTable
      columns={columns as any}
      data={props.data}
      title="Funds"
      options={{
        paging: true,
        pageSize: 20,
        doubleHorizontalScroll: true,
      }}
      isLoading={props.loading}
      onRowClick={(_, rowData) => {
        const url = '/fund?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(FundList);
