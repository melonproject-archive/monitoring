import React from 'react';
import * as R from 'ramda';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback, Tooltip } from '@material-ui/core';
import { FundListQuery } from '~/queries/FundListQuery';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { hexToString } from '~/utils/hexToString';
import { sortBigNumber } from '~/utils/sortBigNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';

export interface FundListProps {
  data?: any;
}

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns = [
  {
    title: 'Name',
    field: 'name',
  },
  {
    title: 'Creation date',
    render: rowData => {
      return formatDate(rowData.createdAt, true);
    },
    customSort: (a, b) => sortBigNumber(a, b, 'createdAt'),
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
    title: 'AUM [ETH]',
    type: 'numeric',
    render: rowData => {
      return (
        <Tooltip title={formatBigNumber(rowData.gav, 18, 18)}>
          <span>{formatBigNumber(rowData.gav, 18, 4)}</span>
        </Tooltip>
      );
    },
    customSort: (a, b) => sortBigNumber(a, b, 'gav'),
  },
  {
    title: 'Share price',
    type: 'numeric',
    render: rowData => {
      return (
        <Tooltip title={formatBigNumber(rowData.sharePrice, 18, 18)}>
          <span>{formatBigNumber(rowData.sharePrice, 18, 4)}</span>
        </Tooltip>
      );
    },
    customSort: (a, b) => sortBigNumber(a, b, 'sharePrice'),
    defaultSort: 'desc',
  },
  {
    title: 'Number of shares',
    type: 'numeric',
    render: rowData => {
      return (
        <Tooltip title={formatBigNumber(rowData.totalSupply, 18, 18)}>
          <span>{formatBigNumber(rowData.totalSupply, 18, 4)}</span>
        </Tooltip>
      );
    },
    customSort: (a, b) => sortBigNumber(a, b, 'totalSupply'),
  },
  {
    title: 'Protocol version',
    field: 'versionName',
  },
  {
    title: 'Status',
    render: rowData => {
      return rowData.isShutdown ? 'Not active' : 'Active';
    },
    customSort: (a, b) => {
      return a.isShutdown === b.isShutdown ? 0 : a.isShutdown ? 1 : -1;
    },
  },
];

const FundList: React.FunctionComponent<FundListProps> = props => {
  const result = useScrapingQuery([FundListQuery, FundListQuery], proceedPaths(['funds']), {
    ssr: false,
  });

  const funds = R.pathOr([], ['data', 'funds'], result).map(fund => {
    return {
      ...fund,
      versionName: hexToString(fund.version.name),
    };
  });

  return (
    <MaterialTable
      columns={columns as any}
      data={funds}
      title="Funds"
      options={{
        paging: false,
      }}
      isLoading={result.loading}
      onRowClick={(_, rowData) => {
        const url = '/fund?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(FundList);
