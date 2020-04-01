import React from 'react';

import { withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';
import EtherscanLink from '../EtherscanLink';

export interface EventListProps {
  events: any;
  loading: boolean;
}

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns = [
  {
    title: 'Date',
    render: (rowData) => {
      return formatDate(rowData.timestamp, true);
    },
    type: 'numeric',
    customSort: (a, b) => sortBigNumber(a, b, 'timestamp'),
    cellStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Address',
    render: (rowData) => {
      return <EtherscanLink address={rowData.contract.id} short={true} />;
    },
  },
  {
    title: 'Sender',
    render: (rowData) => {
      return <EtherscanLink address={rowData.from} short={true} />;
    },
  },
  {
    title: 'Tx hash',
    render: (rowData) => {
      return <EtherscanLink tx={rowData.hash} short={true} />;
    },
  },

  {
    title: 'Event',
    field: 'name',
  },
  {
    title: 'Parameters',
    render: (rowData) => {
      return (
        <pre>
          {rowData.parameters
            .map((p) => {
              return `${p.name}: ${p.value}`;
            })
            .join('\n')}
        </pre>
      );
    },
  },
];

const EventList: React.FunctionComponent<EventListProps> = (props) => {
  return (
    <Grid item={true} xs={12} sm={12} md={12}>
      <MaterialTable
        columns={columns as any}
        data={props.events}
        title="Events"
        options={{
          paging: true,
          pageSize: 50,
          doubleHorizontalScroll: true,
        }}
        isLoading={props.loading}
      />
    </Grid>
  );
};

export default withStyles(styles)(EventList);
