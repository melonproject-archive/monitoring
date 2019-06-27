import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper, NoSsr } from '@material-ui/core';
import { InvestorCountQuery, InvestmentHistoryQuery } from '~/queries/InvestorListQuery';

import Layout from '~/components/Layout';
import TimeSeriesChart from '~/components/TimeSeriesChart';
import InvestorList from '~/components/InvestorList';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { useQuery } from '@apollo/react-hooks';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type InvestorsProps = WithStyles<typeof styles>;

const Investors: React.FunctionComponent<InvestorsProps> = props => {
  const result = useScrapingQuery([InvestorCountQuery, InvestorCountQuery], proceedPaths(['investorCounts']), {
    ssr: false,
  });

  const investorCounts = (result.data && result.data.investorCounts) || [];
  const maxNumberOfInvestors = Math.max(...investorCounts.map(item => item.numberOfInvestors), 0);

  const investmentHistoryResult = useQuery(InvestmentHistoryQuery, { ssr: false, variables: { limit: 10 } });

  const investmentHistory = (investmentHistoryResult.data && investmentHistoryResult.data.investmentHistories) || [];

  return (
    <Layout title="Investors">
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Total number of investments into Melon funds</Typography>
          <TimeSeriesChart
            data={investorCounts}
            dataKeys={['numberOfInvestors']}
            yMax={maxNumberOfInvestors}
            loading={result.loading}
          />
        </Paper>
      </Grid>
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
              },
              {
                title: 'Amount',
                render: rowData => {
                  return formatBigNumber(rowData.amountInDenominationAsset, 18, 3);
                },
                type: 'numeric',
              },
            ]}
            data={investmentHistory}
            title="Latest investments"
            options={{
              paging: false,
              search: false,
            }}
            isLoading={result.loading}
            onRowClick={(_, rowData) => {
              const url = '/investor?address=' + rowData.owner.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Investors);
