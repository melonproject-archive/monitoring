import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, Typography, Paper, NoSsr } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import Layout from '~/components/Layout';

import EtherscanLink from '~/components/EtherscanLink';
import { ContractDetailsQuery } from '~/queries/ContractDetails';
import { formatDate } from '~/utils/formatDate';
import EventList from '~/components/EventList';
import MaterialTable from 'material-table';
import { sortBigNumber } from '~/utils/sortBigNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { ContractEventsQuery } from '~/queries/ContractEventsQuery';

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

type ContractProps = WithStyles<typeof styles>;

const Contract: React.FunctionComponent<ContractProps> = props => {
  const router = useRouter();
  const result = useQuery(ContractDetailsQuery, {
    ssr: false,
    skip: !(router && router.query.address),
    variables: {
      address: router && router.query.address,
    },
  });

  const contract = R.pathOr(undefined, ['data', 'contract'], result);

  const eventListResult = useScrapingQuery([ContractEventsQuery, ContractEventsQuery], proceedPaths(['events']), {
    ssr: false,
    variables: {
      contracts: [router.query.address],
    },
    skip: !router.query.address,
  });

  const events = R.pathOr([], ['data', 'events'], eventListResult);

  return (
    <Layout title="Contract" page="contract">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Contract information</Typography>
          <Grid container={true}>
            <Grid item={true} xs={6} sm={6} md={4}>
              Address
            </Grid>
            <Grid item={true} xs={6} sm={6} md={8}>
              {contract && <EtherscanLink address={contract.id} />}
              {contract && contract.name === 'Hub' && (
                <>
                  &nbsp;
                  <a href={'/fund?address=' + contract.id} className={props.classes.aStyle}>
                    (-> Fund details)
                  </a>
                </>
              )}
            </Grid>
            <Grid item={true} xs={6} sm={6} md={4}>
              Type
            </Grid>
            <Grid item={true} xs={6} sm={6} md={8}>
              {contract && contract.name}
            </Grid>
            <Grid item={true} xs={6} sm={6} md={4}>
              Created at
            </Grid>
            <Grid item={true} xs={6} sm={6} md={8}>
              {contract && formatDate(contract.createdAt, true)}
            </Grid>
            <Grid item={true} xs={6} sm={6} md={4}>
              Parent contract
            </Grid>
            <Grid item={true} xs={6} sm={6} md={8}>
              {contract && contract.parent && (
                <>
                  {contract.parent.name}
                  <br />
                  <a href={'/contract?address=' + contract.parent.id} className={props.classes.aStyle}>
                    {contract.parent.id}
                  </a>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Date',
                render: (rowData: any) => {
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
                title: 'Name',
                field: 'name',
              },
              {
                title: 'Description',
                field: 'description',
              },
              {
                title: 'Address',
                field: 'id',
              },
            ]}
            data={contract && contract.children}
            title="Children"
            options={{
              paging: false,
              search: true,
            }}
            isLoading={result.loading}
            onRowClick={(_, rowData) => {
              const url = '/contract?address=' + rowData.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
      <EventList events={events} loading={eventListResult.loading} />
    </Layout>
  );
};

export default withStyles(styles)(Contract);
