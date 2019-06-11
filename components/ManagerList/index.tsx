import React from 'react';
import MaterialTable from 'material-table';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { sortBigNumber } from '~/utils/sortBigNumber';
import { ManagerListQuery } from '~/queries/ManagerListQuery';
import { formatDate } from '~/utils/formatDate';

export interface ManagerListProps {
  data?: any;
}

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns = [
  {
    title: 'Address',
    field: 'id',
    defaultSort: 'asc',
  },
  {
    title: 'Active since',
    render: rowData => {
      return formatDate(rowData.createdAt);
    },
    type: 'numeric',
    customSort: (a, b) => sortBigNumber(a, b, 'createdAt'),
  },
  {
    title: '# funds',
    field: 'funds.length',
  },
];

const ManagerList: React.FunctionComponent<ManagerListProps> = props => {
  const result = useQuery(ManagerListQuery, {
    ssr: false,
  });

  const data = result.data || {};

  const managers = (data && data.fundManagers) || [];

  return (
    <MaterialTable
      columns={columns as any}
      data={managers}
      title="Fund Managers"
      options={{
        paging: false,
      }}
      isLoading={result.loading}
      onRowClick={(_, rowData) => {
        const url = '/manager?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(ManagerList);
