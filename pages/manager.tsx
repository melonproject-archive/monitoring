import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, StyleRulesCallback, NoSsr } from '@material-ui/core';
import Layout from '~/components/Layout';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { ManagerDetailsQuery } from '~/queries/ManagerDetailsQuery';
import MaterialTable from 'material-table';
import { hexToString } from '~/utils/hexToString';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type ManagerProps = WithStyles<typeof styles>;

const Managers: React.FunctionComponent<ManagerProps> = props => {
  const router = useRouter();
  const result = useQuery(ManagerDetailsQuery, {
    ssr: false,
    skip: !(router && router.query.address),
    variables: {
      manager: router && router.query.address,
    },
  });

  const manager = R.pathOr([], ['data', 'fundManager'], result) as any;

  const funds =
    manager &&
    manager.funds &&
    manager.funds.map(fund => {
      return {
        ...fund,
        versionName: hexToString(fund.version.name),
      };
    });

  return (
    <Layout title="Fund Manager">
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Fund',
                field: 'name',
              },
              {
                title: 'Creation date',
                render: rowData => {
                  return formatDate(rowData.createdAt);
                },
                customSort: (a, b) => sortBigNumber(a, b, 'createdAt'),
              },
              {
                title: 'Protocol version',
                field: 'versionName',
              },
            ]}
            data={funds}
            title={'Funds managed by ' + manager.id}
            options={{
              paging: false,
              search: false,
            }}
            isLoading={result.loading}
            onRowClick={(_, rowData) => {
              const url = '/fund?address=' + rowData.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Managers);
