import React from 'react';
import * as R from 'ramda';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback, Grid } from '@material-ui/core';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { FundDebugInformationQuery } from '~/queries/FundDebugInformationQuery';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';
import EtherscanLink from '../EtherscanLink';

export interface FundDebugInformationProps {
  address: string;
}

const styles: StyleRulesCallback = theme => ({
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
  },
  {
    title: 'Contract',
    field: 'contract',
  },
  {
    title: 'Contract Address',
    render: rowData => {
      return <EtherscanLink address={rowData.contractAddress} />;
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

const FundDebugInformation: React.FunctionComponent<FundDebugInformationProps> = props => {
  const debugInformationResult = useScrapingQuery(
    [FundDebugInformationQuery, FundDebugInformationQuery],
    proceedPaths(['eventHistories']),
    {
      ssr: false,
      variables: {
        fund: props.address,
      },
    },
  );

  const fundEvents = R.pathOr([], ['data', 'eventHistories'], debugInformationResult);

  return (
    <Grid item={true} xs={12} sm={12} md={12}>
      <MaterialTable
        columns={columns as any}
        data={fundEvents}
        title="DEBUG: events related to fund"
        options={{
          paging: false,
        }}
        isLoading={debugInformationResult.loading}
      />
    </Grid>
  );
};

export default withStyles(styles)(FundDebugInformation);
