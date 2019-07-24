import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, NoSsr } from '@material-ui/core';
import { InvestmentHistoryQuery, InvestmentRequestsQuery } from '~/queries/InvestorListQuery';

import Layout from '~/components/Layout';
import InvestorList from '~/components/InvestorList';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { useQuery } from '@apollo/react-hooks';
import TooltipNumber from '~/components/TooltipNumber';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type InvestorsProps = WithStyles<typeof styles>;

const Investors: React.FunctionComponent<InvestorsProps> = props => {
  const investmentHistoryResult = useQuery(InvestmentHistoryQuery, { ssr: false, variables: { limit: 10 } });

  const investmentHistory = (investmentHistoryResult.data && investmentHistoryResult.data.investmentHistories) || [];

  const investmentRequestsResult = useScrapingQuery(
    [InvestmentRequestsQuery, InvestmentRequestsQuery],
    proceedPaths(['investmentRequests']),
    { ssr: false },
  );

  const investmentRequests = (
    (investmentRequestsResult.data && investmentRequestsResult.data.investmentRequests) ||
    []
  ).map(item => {
    let expires = parseInt(item.requestTimestamp, 10) + 24 * 60 * 60;
    let status = item.status;
    if (new Date().getTime() > new Date(expires * 1000).getTime()) {
      status = 'EXPIRED';
      expires = undefined;
    }
    return {
      ...item,
      status,
      expires,
    };
  });

  return (
    <Layout title="Investors">
      <Grid item={true} xs={12}>
        <InvestorList />
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Time',
                field: 'timestamp',
                render: rowData => {
                  return formatDate(rowData.timestamp, true);
                },
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Investor',
                field: 'owner.id',
              },
              {
                title: 'Action',
                field: 'action',
              },
              {
                title: 'Fund',
                field: 'fund.name',
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Amount [ETH]',
                render: rowData => {
                  return formatBigNumber(rowData.amountInDenominationAsset, 18, 3);
                },
                type: 'numeric',
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
            ]}
            data={investmentHistory}
            title="Latest investments"
            options={{
              paging: false,
              search: false,
            }}
            isLoading={investmentHistoryResult.loading}
            onRowClick={(_, rowData) => {
              const url = '/investor?address=' + rowData.owner.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
      {investmentRequests && (
        <Grid item={true} xs={12}>
          <NoSsr>
            <MaterialTable
              columns={[
                {
                  title: 'Date',
                  render: rowData => {
                    return formatDate(rowData.requestTimestamp, true);
                  },
                  cellStyle: {
                    whiteSpace: 'nowrap',
                  },
                },
                {
                  title: 'Fund',
                  field: 'fund.name',
                  cellStyle: {
                    whiteSpace: 'nowrap',
                  },
                },
                {
                  title: 'Investor',
                  field: 'owner.id',
                },
                {
                  title: 'Shares',
                  render: rowData => {
                    return <TooltipNumber number={rowData.shares} />;
                  },
                  type: 'numeric',
                },
                {
                  title: 'Amount',
                  render: rowData => {
                    return <TooltipNumber number={rowData.amount} decimals={rowData.asset.decimals} />;
                  },
                  type: 'numeric',
                },
                {
                  title: 'Asset',
                  field: 'asset.symbol',
                },
                {
                  title: 'Status',
                  field: 'status',
                },
                {
                  title: 'Expires',
                  render: rowData => {
                    return rowData.expires && formatDate(rowData.expires, true);
                  },
                  cellStyle: {
                    whiteSpace: 'nowrap',
                  },
                },
              ]}
              data={investmentRequests}
              title="Pending investments"
              options={{
                paging: false,
                search: false,
              }}
              isLoading={investmentRequestsResult.loading}
              onRowClick={(_, rowData) => {
                const url = '/investor?address=' + rowData.owner.id;
                window.open(url, '_self');
              }}
            />
          </NoSsr>
        </Grid>
      )}
    </Layout>
  );
};

export default withStyles(styles)(Investors);
