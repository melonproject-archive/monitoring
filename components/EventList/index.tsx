import React from 'react';
import * as R from 'ramda';

import { withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { EventListFundQuery, EventListContractQuery } from '~/queries/EventListQuery';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';
import EtherscanLink from '../EtherscanLink';

export interface EventListProps {
  fund?: string;
  contract?: string;
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
    title: 'Contract',
    field: 'contract',
  },
  {
    title: 'Address',
    render: rowData => {
      return <EtherscanLink address={rowData.contractAddress} short={true} />;
    },
  },
  {
    title: 'Tx hash',
    render: rowData => {
      const hash = rowData.id.substring(0, 66);
      return <EtherscanLink tx={hash} short={true} />;
    },
  },

  {
    title: 'Event',
    field: 'event',
  },
  {
    title: 'Parameters',
    render: rowData => {
      return (
        <pre>
          {rowData.params
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
  const query = props.fund ? EventListFundQuery : EventListContractQuery;

  const eventListResult = useScrapingQuery([query, query], proceedPaths(['eventHistories']), {
    ssr: false,
    variables: {
      address: props.fund || props.contract,
    },
  });

  const fundEvents = R.pathOr([], ['data', 'eventHistories'], eventListResult);

  return (
    <Grid item={true} xs={12} sm={12} md={12}>
      <MaterialTable
        columns={columns as any}
        data={fundEvents}
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
