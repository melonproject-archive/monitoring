import React from 'react';
import * as R from 'ramda';

import { withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';
import EtherscanLink from '../EtherscanLink';
import { ContractEventsQuery } from '~/queries/ContractEventsQuery';

export interface EventListProps {
  contracts: string[];
}

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns = [
  {
    title: 'Date',
    render: rowData => {
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
    render: rowData => {
      return <EtherscanLink address={rowData.contract.id} short={true} />;
    },
  },
  {
    title: 'Sender',
    render: rowData => {
      return <EtherscanLink address={rowData.from} short={true} />;
    },
  },
  {
    title: 'Tx hash',
    render: rowData => {
      return <EtherscanLink tx={rowData.hash} short={true} />;
    },
  },

  {
    title: 'Event',
    field: 'name',
  },
  {
    title: 'Parameters',
    render: rowData => {
      return (
        <pre>
          {rowData.parameters
            .map(p => {
              return `${p.name}: ${p.value}`;
            })
            .join('\n')}
        </pre>
      );
    },
  },
];

const EventList: React.FunctionComponent<EventListProps> = props => {
  const query = ContractEventsQuery;

  const eventListResult = useScrapingQuery([query, query], proceedPaths(['events']), {
    ssr: false,
    variables: {
      contracts: props.contracts,
    },
    skip: !props.contracts,
  });

  const events = R.pathOr([], ['data', 'events'], eventListResult);

  return (
    <Grid item={true} xs={12} sm={12} md={12}>
      <MaterialTable
        columns={columns as any}
        data={events}
        title="Events"
        options={{
          paging: false,
        }}
        isLoading={eventListResult.loading}
      />
    </Grid>
  );
};

export default withStyles(styles)(EventList);
