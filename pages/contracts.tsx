import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, NoSsr } from '@material-ui/core';
import { ContractsQuery } from '~/queries/ContractList';
import Layout from '~/components/Layout';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';
import { sortBigNumber } from '~/utils/sortBigNumber';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type ContractsProps = WithStyles<typeof styles>;

const Contracts: React.FunctionComponent<ContractsProps> = props => {
  const contractResult = useScrapingQuery([ContractsQuery, ContractsQuery], proceedPaths(['contracts']), {
    ssr: false,
  });

  const contracts = (contractResult.data && contractResult.data.contracts) || [];

  return (
    <Layout title="Contracts">
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Contract',
                field: 'name',
              },
              {
                title: 'Description',
                field: 'description',
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Address',
                field: 'id',
              },
              {
                title: 'Creation date',
                render: rowData => {
                  return formatDate(rowData.createdAt, true);
                },
                customSort: (a, b) => sortBigNumber(a, b, 'createdAt'),
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Parent',
                field: 'parent.name',
              },
              {
                title: 'Children',
                field: 'children.length',
                type: 'numeric',
              },
            ]}
            data={contracts}
            title={'Contracts'}
            options={{
              paging: true,
              pageSize: 20,
              search: true,
            }}
            isLoading={contractResult.loading}
            onRowClick={(_, rowData) => {
              const url = '/contract?address=' + rowData.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Contracts);
