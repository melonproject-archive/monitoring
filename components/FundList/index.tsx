import React from 'react';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';

import BigNumber from 'bignumber.js';
import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { FundListQuery } from '~/queries/FundOverviewQuery';
import { formatBigNumber } from '~/utils/formatBigNumber';

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
      return formatDate(rowData.creationTime);
    },
    customSort: (a, b) => {
      return new BigNumber(a.creationTime).isGreaterThan(new BigNumber(b.creationTime))
        ? 1
        : new BigNumber(b.creationTime).isGreaterThan(new BigNumber(a.creationTime))
        ? -1
        : 0;
    },
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
      return formatBigNumber(rowData.gav, 18, 3);
    },
    customSort: (a, b) => {
      return new BigNumber(a.gav).isGreaterThan(new BigNumber(b.gav))
        ? 1
        : new BigNumber(b.gav).isGreaterThan(new BigNumber(a.gav))
        ? -1
        : 0;
    },
  },
  {
    title: 'Share price',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.sharePrice, 18, 3);
    },
    customSort: (a, b) => {
      return new BigNumber(a.sharePrice).isGreaterThan(new BigNumber(b.sharePrice))
        ? 1
        : new BigNumber(b.sharePrice).isGreaterThan(new BigNumber(a.sharePrice))
        ? -1
        : 0;
    },
    defaultSort: 'desc',
  },
  {
    title: 'Number of shares',
    type: 'numeric',
    render: rowData => {
      return formatBigNumber(rowData.totalSupply, 18, 3);
    },
    customSort: (a, b) => {
      return new BigNumber(a.totalSupply).isGreaterThan(new BigNumber(b.totalSupply))
        ? 1
        : new BigNumber(b.totalSupply).isGreaterThan(new BigNumber(a.totalSupply))
        ? -1
        : 0;
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
  },
];

const FundList: React.FunctionComponent<FundListProps> = props => {
  const result = useScrapingQuery([FundListQuery, FundListQuery], proceedPaths(['funds']), {
    ssr: false,
  });

  const data = result.data || {};

  const funds = (data.funds || []).sort((a, b) => {
    return b.sharePrice - a.sharePrice;
  });

  return (
    <MaterialTable
      columns={columns as any}
      data={funds}
      title="Funds"
      options={{
        paging: false,
      }}
      onRowClick={(_, rowData) => {
        const url = '/fund?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(FundList);
