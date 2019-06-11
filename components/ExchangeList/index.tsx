import React from 'react';
import MaterialTable from 'material-table';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';

export interface AssetListProps {
  data: any;
  loading?: boolean;
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
    title: '# funds',
    field: 'tradings.length',
    type: 'numeric',
  },
  {
    title: '# trades',
    field: 'calls.length',
    type: 'numeric',
    defaultSort: 'desc',
  },
];

const ExchangeList: React.FunctionComponent<AssetListProps> = props => {
  return (
    <MaterialTable
      columns={columns as any}
      data={props.data}
      title="Exchanges"
      options={{
        paging: false,
      }}
      isLoading={props.loading}
      onRowClick={(_, rowData) => {
        const url = '/exchange?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(ExchangeList);
