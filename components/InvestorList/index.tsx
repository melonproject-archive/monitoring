import React from 'react';
import * as R from 'ramda';
import MaterialTable from 'material-table';

import BigNumber from 'bignumber.js';
import { withStyles } from '@material-ui/styles';
import { InvestorListQuery } from '~/queries/InvestorListQuery';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { robustIRR } from '~/utils/robustIRR';
import { prepareCashFlows } from '~/utils/prepareCashFlows';
import { moneyMultiple } from '~/utils/moneyMultiple';
import TooltipNumber from '../TooltipNumber';
import ShortAddress from '../ShortAddress';

export interface InvestorListProps {
  data?: any;
}

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns = [
  {
    title: 'Address',
    render: (rowData) => <ShortAddress address={rowData.id} length={16} />,
  },
  {
    title: 'Investor since',
    render: (rowData) => formatDate(rowData.createdAt),
    customSort: (a, b) => sortBigNumber(a, b, 'createdAt'),
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Investments',
    field: 'investments.length',
    type: 'numeric',
  },
  {
    title: 'AUM [ETH]',
    type: 'numeric',
    render: (rowData) => <TooltipNumber number={rowData.netAum} />,
    customSort: (a, b) => sortBigNumber(a, b, 'netAum'),
    defaultSort: 'desc',
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Money multiple',
    field: 'multiple',
    type: 'numeric',
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Annualized return [%]',
    field: 'xirr',
    type: 'numeric',
    cellStyle: {
      whiteSpace: 'nowrap',
    },
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
];

const InvestorList: React.FunctionComponent<InvestorListProps> = () => {
  const result = useScrapingQuery([InvestorListQuery, InvestorListQuery], proceedPaths(['investors']), {
    ssr: false,
  });

  const investors = R.pathOr([], ['data', 'investors'], result);

  const investorsInclAum =
    investors &&
    investors.map((investor) => {
      const cashflows = prepareCashFlows(investor.investmentHistory, investor.valuationHistory[0]?.nav || 0);
      return {
        ...investor,
        netAum: investor.investments.reduce((carry, item) => {
          return new BigNumber(carry).plus(new BigNumber(item.nav));
        }, new BigNumber(0)),
        xirr: robustIRR(cashflows),
        multiple: moneyMultiple(cashflows),
      };
    });

  return (
    <MaterialTable
      columns={columns as any}
      data={investorsInclAum}
      title="Investors"
      options={{
        paging: true,
        pageSize: 10,
      }}
      isLoading={result.loading}
      onRowClick={(_, rowData) => {
        const url = '/investor?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(InvestorList);
