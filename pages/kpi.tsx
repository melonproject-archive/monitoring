import React, { useState } from 'react';
import * as R from 'ramda';

import { Grid, withStyles, WithStyles } from '@material-ui/core';

import Layout from '~/components/Layout';
import MaterialTable from 'material-table';
import { useQuery } from '@apollo/react-hooks';
import {
  MonthlyInvestorCountQuery,
  MonthlyInvestmentCountQuery,
  MonthlyAumQuery,
  MonthlyTradeCountQuery,
  MonthlyFundCountQuery,
} from '~/queries/MonthlyQuery';
import { formatBigNumber } from '~/utils/formatBigNumber';
import BigNumber from 'bignumber.js';

interface MonthlyQuantity {
  value: number;
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
const currentYear = new Date().getUTCFullYear();
const currentMonth = new Date().getMonth();

const renderCell = (rowData, year, month) => {
  if (year === currentYear && month > currentMonth + 1) {
    return <></>;
  }
  if (!rowData[`m${month}`].value || isNaN(rowData[`m${month}`].value)) {
    return <></>;
  }

  return (
    <>
      {rowData[`m${month}`].value} {!isNaN(rowData[`m${month}`].change) && `(${rowData[`m${month}`].change})`}
    </>
  );
};
const KPI: React.FunctionComponent<KPIProps> = () => {
  const [year, setYear] = useState(currentYear);

  const timestamps = R.range(0, 13).map((r) => startOfMonth(r, year));
  const queryVariables = timestamps.reduce((acc, item, index) => ({ ...acc, ['d' + index]: item }), {});

  // funds
  const fundsResult = useQuery(MonthlyFundCountQuery, {
    ssr: false,
    variables: queryVariables,
  });
  const fundsData = fundsResult?.data;
  const fundsMonthly = R.range(1, 13)
    .map((r) => ({
      value: parseInt(fundsData?.[`m${r}`]?.[0]?.active, 10) + parseInt(fundsData?.[`m${r}`]?.[0]?.nonActive, 10),
      change:
        parseInt(fundsData?.[`m${r}`]?.[0]?.active, 10) +
        parseInt(fundsData?.[`m${r}`]?.[0]?.nonActive, 10) -
        (!isNaN(fundsData?.[`m${r - 1}`]?.[0]?.active) ? fundsData?.[`m${r - 1}`]?.[0]?.active : 0) -
        (!isNaN(fundsData?.[`m${r - 1}`]?.[0]?.nonActive) ? fundsData?.[`m${r - 1}`]?.[0]?.nonActive : 0),
    }))
    .reduce((acc, item, index) => ({ ...acc, [`m${index + 1}`]: item }), {});

  // investors
  const investorResult = useQuery(MonthlyInvestorCountQuery, {
    ssr: false,
    variables: queryVariables,
  });
  const investorData = investorResult?.data;
  const investorMonthly = R.range(1, 13)
    .map((r) => ({
      value: investorData?.[`m${r}`]?.[0]?.active,
      change:
        investorData?.[`m${r}`]?.[0]?.active -
        (!isNaN(investorData?.[`m${r - 1}`]?.[0]?.active) ? investorData?.[`m${r - 1}`]?.[0]?.active : 0),
    }))
    .reduce((acc, item, index) => ({ ...acc, [`m${index + 1}`]: item }), {});

  // investments
  const investmentResult = useQuery(MonthlyInvestmentCountQuery, {
    ssr: false,
    variables: queryVariables,
  });
  const investmentData = investmentResult?.data;
  const investmentMonthly = R.range(1, 13)
    .map((r) => ({
      value: investmentData?.[`m${r}`]?.[0]?.active,
      change:
        investmentData?.[`m${r}`]?.[0]?.active -
        (!isNaN(investmentData?.[`m${r - 1}`]?.[0]?.active) ? investmentData?.[`m${r - 1}`]?.[0]?.active : 0),
    }))
    .reduce((acc, item, index) => ({ ...acc, [`m${index + 1}`]: item }), {});

  // AUM
  const aumResult = useQuery(MonthlyAumQuery, {
    ssr: false,
    variables: queryVariables,
  });
  const aumData = aumResult?.data;
  const aumMonthly = R.range(1, 13)
    .map((r) => ({
      value: formatBigNumber(aumData?.[`m${r}`]?.[0]?.gav, 18, 0),
      change: new BigNumber(aumData?.[`m${r}`]?.[0]?.gav)
        .minus(new BigNumber(aumData?.[`m${r - 1}`]?.[0]?.gav || 0))
        .dividedBy('1e18')
        .integerValue(),
    }))
    .reduce((acc, item, index) => ({ ...acc, [`m${index + 1}`]: item }), {});

  // Trades
  const tradeResult = useQuery(MonthlyTradeCountQuery, {
    ssr: false,
    variables: queryVariables,
  });
  const tradeData = tradeResult?.data;
  const tradeMonthly = R.range(1, 13)
    .map((r) => ({
      value: tradeData?.[`m${r}`]?.[0]?.all,
      change:
        tradeData?.[`m${r}`]?.[0]?.all -
        (!isNaN(tradeData?.[`m${r - 1}`]?.[0]?.all) ? tradeData?.[`m${r - 1}`]?.[0]?.all : 0),
    }))
    .reduce((acc, item, index) => ({ ...acc, [`m${index + 1}`]: item }), {});

  const list = [
    {
      quantity: '# Funds',
      ...fundsMonthly,
    },
    {
      quantity: '# Investors',
      ...investorMonthly,
    },
    { quantity: '# Investments', ...investmentMonthly },
    { quantity: 'AUM [ETH]', ...aumMonthly },
    { quantity: '# Trades', ...tradeMonthly },
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
              render: (rowData) => renderCell(rowData, year, '1'),
            },
            {
              title: 'Feb',
              render: (rowData) => renderCell(rowData, year, '2'),
            },
            {
              title: 'Mar',
              render: (rowData) => renderCell(rowData, year, '3'),
            },
            {
              title: 'Apr',
              render: (rowData) => renderCell(rowData, year, '4'),
            },
            {
              title: 'May',
              render: (rowData) => renderCell(rowData, year, '5'),
            },
            {
              title: 'Jun',
              render: (rowData) => renderCell(rowData, year, '6'),
            },
            {
              title: 'Jul',
              render: (rowData) => renderCell(rowData, year, '7'),
            },
            {
              title: 'Aug',
              render: (rowData) => renderCell(rowData, year, '8'),
            },
            {
              title: 'Sep',
              render: (rowData) => renderCell(rowData, year, '9'),
            },
            {
              title: 'Oct',
              render: (rowData) => renderCell(rowData, year, '10'),
            },
            {
              title: 'Nov',
              render: (rowData) => renderCell(rowData, year, '11'),
            },
            {
              title: 'Dec',
              render: (rowData) => renderCell(rowData, year, '12'),
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
        <button onClick={() => setYear(year - 1)} disabled={year === 2019}>
          Previous year
        </button>
        <button onClick={() => setYear(year + 1)} disabled={year === currentYear}>
          Next year
        </button>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(KPI);
