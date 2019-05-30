import React from 'react';
import * as R from 'ramda';
import MaterialTable from 'material-table';

import BigNumber from 'bignumber.js';
import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { InvestorListQuery } from '~/queries/InvestorsQuery';

export interface InvestorListProps {
  data?: any;
}

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const columns = [
  {
    title: 'Address',
    field: 'id',
  },
  {
    title: 'Investments',
    field: 'investments.length',
    type: 'numeric',
  },
  {
    title: 'AUM [ETH] (incorrect numbers!)',
    type: 'numeric',
    field: 'aum',
  },
];

const InvestorList: React.FunctionComponent<InvestorListProps> = props => {
  const result = useScrapingQuery([InvestorListQuery, InvestorListQuery], proceedPaths(['investors']), {
    ssr: false,
  });

  const investors = R.pathOr([], ['data', 'investors'], result);

  const investorsInclAum =
    investors &&
    investors.map(investor => {
      return {
        ...investor,
        aum: formatBigNumber(
          investor.investments.reduce((carry, item) => {
            return new BigNumber(carry).plus(new BigNumber(item.gav));
          }, new BigNumber(0)),
        ),
      };
    });

  return (
    <MaterialTable
      columns={columns as any}
      data={investorsInclAum}
      title="Investors"
      options={{
        paging: false,
      }}
      onRowClick={(_, rowData) => {
        const url = '/investor?address=' + rowData.id;
        window.open(url, '_self');
      }}
    />
  );
};

export default withStyles(styles)(InvestorList);
