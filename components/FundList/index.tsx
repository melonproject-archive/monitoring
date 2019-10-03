import React from 'react';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';

import { withStyles } from '@material-ui/styles';
import { Tooltip, Typography } from '@material-ui/core';
import { sortBigNumber } from '~/utils/sortBigNumber';
import TooltipNumber from '../TooltipNumber';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { formatThousands } from '~/utils/formatThousands';
import BigNumber from 'bignumber.js';
import { TypographyProps } from '@material-ui/core/Typography';

export interface FundListProps {
  data?: any;
  loading?: boolean;
  ethusd?: number;
}

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  positiveChange: {
    color: '#ff0000',
  },
});

const FundList: React.FunctionComponent<FundListProps> = props => {
  const percentageChange = (current, previous) => {
    if (current && previous) {
      const bnCurrent = new BigNumber(current.sharePrice);
      const bnPrevious = new BigNumber(previous.sharePrice);

      const timeSpan = current.timestamp - previous.timestamp;
      const returnSinceLastPriceUpdate = bnCurrent.dividedBy(bnPrevious).toNumber() - 1;
      const dailyReturn = 100 * (Math.pow(1 + returnSinceLastPriceUpdate, (24 * 60 * 60) / timeSpan) - 1);

      const color = dailyReturn > 0 ? 'secondary' : dailyReturn < 0 ? 'error' : 'primary';
      const prefix = dailyReturn > 0 ? '+' : '';

      return { color, prefix, dailyReturn };
    } else {
      return { color: 'primary', prefix: '', dailyReturn: 0 };
    }
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
        const change = percentageChange(rowData.calculationsHistory[0], rowData.calculationsHistory[1]);
        return (
          <Typography variant="body2" color={change.color as TypographyProps['color']}>
            {change.prefix}
            {change.dailyReturn.toFixed(2)}%
          </Typography>
        );
      },
      customSort: (a, b) =>
        percentageChange(a.calculationsHistory[0], a.calculationsHistory[1]).dailyReturn -
        percentageChange(b.calculationsHistory[0], b.calculationsHistory[1]).dailyReturn,
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
      onRowClick={(_, rowData: any) => {
        const url = '/fund?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(FundList);
