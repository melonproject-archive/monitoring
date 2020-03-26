import React, { useState } from 'react';
import * as R from 'ramda';

import { Grid, withStyles, WithStyles } from '@material-ui/core';

import Layout from '~/components/Layout';
import MaterialTable from 'material-table';
import { useQuery } from '@apollo/react-hooks';
import { MonthlyInvestorCountQuery, MonthlyInvestmentCountQuery } from '~/queries/MonthlyQuery';

interface MonthlyQuantity {
  active: number;
  change: number;
}

interface AnnualQuantityList {
  quantity: string;
  m1: MonthlyQuantity;
  m2: MonthlyQuantity;
  m3: MonthlyQuantity;
  m4: MonthlyQuantity;
  m5: MonthlyQuantity;
  m6: MonthlyQuantity;
  m7: MonthlyQuantity;
  m8: MonthlyQuantity;
  m9: MonthlyQuantity;
  m10: MonthlyQuantity;
  m11: MonthlyQuantity;
  m12: MonthlyQuantity;
}

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type KPIProps = WithStyles<typeof styles>;

const startOfMonth = (month: number, year: number) => new Date(year, month, 1).getTime() / 1000;

const KPI: React.FunctionComponent<KPIProps> = () => {
  const [year, setYear] = useState(2020);

  const timestamps = R.range(0, 13).map((r) => startOfMonth(r, year));
  const queryVariables = timestamps.reduce((acc, item, index) => ({ ...acc, ['d' + index]: item }), {});

  const investorResult = useQuery(MonthlyInvestorCountQuery, {
    ssr: false,
    variables: queryVariables,
  });
  const investorData = investorResult?.data;
  const investorMonthly = R.range(1, 13)
    .map((r) => ({
      active: investorData?.[`m${r}`]?.[0]?.active,
      change: investorData?.[`m${r}`]?.[0]?.active - investorData?.[`m${r - 1}`]?.[0]?.active,
    }))
    .reduce((acc, item, index) => ({ ...acc, [`m${index + 1}`]: item }), {});

  const investmentResult = useQuery(MonthlyInvestmentCountQuery, {
    ssr: false,
    variables: queryVariables,
  });
  const investmentData = investmentResult?.data;
  const investmentMonthly = R.range(1, 13)
    .map((r) => ({
      active: investmentData?.[`m${r}`]?.[0]?.active,
      change: investmentData?.[`m${r}`]?.[0]?.active - investmentData?.[`m${r - 1}`]?.[0]?.active,
    }))
    .reduce((acc, item, index) => ({ ...acc, [`m${index + 1}`]: item }), {});

  const list = [
    {
      quantity: 'Investors',
      ...investorMonthly,
    },
    { quantity: 'Investments', ...investmentMonthly },
  ] as AnnualQuantityList[];

  return (
    <Layout title="Monthly key numbers" page="monthly">
      <Grid item={true} xs={12} sm={12} md={12}>
        <MaterialTable
          columns={[
            {
              title: 'Quantity',
              field: 'quantity',
              cellStyle: {
                whiteSpace: 'nowrap',
              },
              headerStyle: {
                whiteSpace: 'nowrap',
              },
            },
            {
              title: 'Jan',
              field: 'm1.active',
              render: (rowData) => (
                <>
                  {rowData.m1.active} ({rowData.m1.change})
                </>
              ),
            },
            {
              title: 'Feb',
              field: 'm2.active',
              render: (rowData) => (
                <>
                  {rowData.m2.active} ({rowData.m2.change})
                </>
              ),
            },
            {
              title: 'Mar',
              field: 'm3.active',
              render: (rowData) => (
                <>
                  {rowData.m3.active} ({rowData.m3.change})
                </>
              ),
            },
            {
              title: 'Apr',
              field: 'm4.active',
              render: (rowData) => (
                <>
                  {rowData.m4.active} ({rowData.m4.change})
                </>
              ),
            },
            {
              title: 'May',
              field: 'm5.active',
              render: (rowData) => (
                <>
                  {rowData.m5.active} ({rowData.m5.change})
                </>
              ),
            },
            {
              title: 'Jun',
              field: 'm6.active',
              render: (rowData) => (
                <>
                  {rowData.m6.active} ({rowData.m6.change})
                </>
              ),
            },
            {
              title: 'Jul',
              field: 'm7.active',
              render: (rowData) => (
                <>
                  {rowData.m7.active} ({rowData.m7.change})
                </>
              ),
            },
            {
              title: 'Aug',
              field: 'm8.active',
              render: (rowData) => (
                <>
                  {rowData.m8.active} ({rowData.m8.change})
                </>
              ),
            },
            {
              title: 'Sep',
              field: 'm9.active',
              render: (rowData) => (
                <>
                  {rowData.m9.active} ({rowData.m9.change})
                </>
              ),
            },
            {
              title: 'Oct',
              field: 'm10.active',
              render: (rowData) => (
                <>
                  {rowData.m10.active} ({rowData.m10.change})
                </>
              ),
            },
            {
              title: 'Nov',
              field: 'm11.active',
              render: (rowData) => (
                <>
                  {rowData.m11.active} ({rowData.m11.change})
                </>
              ),
            },
            {
              title: 'Dec',
              field: 'm12.active',
              render: (rowData) => (
                <>
                  {rowData.m12.active} ({rowData.m12.change})
                </>
              ),
            },
          ]}
          data={list}
          title={`Monthly key numbers for ${year}`}
          options={{
            paging: false,
            search: false,
            doubleHorizontalScroll: true,
          }}
          isLoading={investorResult.loading}
          onRowClick={(_, rowData: any) => {
            const url = '/investor?address=' + rowData.owner.id;
            window.open(url, '_self');
          }}
        />
        <button onClick={() => setYear(year - 1)}>Previous year</button>
        <button onClick={() => setYear(year + 1)}>Next year</button>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(KPI);
