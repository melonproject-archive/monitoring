import React from 'react';
import { Grid, withStyles, WithStyles, NoSsr } from '@material-ui/core';

import Layout from '~/components/Layout';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';
import ShortAddress from '~/components/ShortAddress';
import { InvestmentListQuery } from '~/queries/InvestmentListQuery';
import TooltipNumber from '~/components/TooltipNumber';
import { sortBigNumber } from '~/utils/sortBigNumber';
import BigNumber from 'bignumber.js';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type InvestmentsProps = WithStyles<typeof styles>;

const Investments: React.FunctionComponent<InvestmentsProps> = () => {
  const result = useScrapingQuery([InvestmentListQuery, InvestmentListQuery], proceedPaths(['investors']), {
    ssr: false,
  });

  const investments =
    result &&
    result.data &&
    result.data.investments &&
    result.data.investments.map((investment, index, array) => ({
      ...investment,
      index: array.length - index,
      active: !new BigNumber(investment.shares).isZero(),
    }));

  const loading = result && result.loading;

  return (
    <Layout title="Investments" page="investments">
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Nr.',
                field: 'index',
              },
              {
                title: 'Time',
                field: 'timestamp',
                render: (rowData) => {
                  return formatDate(rowData.createdAt, true);
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
                render: (rowData) => <ShortAddress address={rowData.owner.id} />,
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
                title: 'Shares',
                render: (rowData: any) => <TooltipNumber number={rowData.shares} />,
                customSort: (a, b) => sortBigNumber(a, b, 'shares'),
                type: 'numeric',
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'NAV [ETH]',
                render: (rowData: any) => <TooltipNumber number={rowData.nav} />,
                customSort: (a, b) => sortBigNumber(a, b, 'nav'),

                type: 'numeric',
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Active',
                render: (rowData: any) => (rowData.active ? 'Yes' : 'No'),
                customSort: (a, b) => {
                  return a.active === b.active ? 0 : a.active ? 1 : -1;
                },
              },
            ]}
            data={investments}
            title="Latest investments and redemptions"
            options={{
              paging: false,
              search: false,
              doubleHorizontalScroll: true,
            }}
            isLoading={loading}
            onRowClick={(_, rowData: any) => {
              const url = '/investor?address=' + rowData.owner.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Investments);
