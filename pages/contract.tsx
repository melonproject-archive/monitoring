import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import Layout from '~/components/Layout';

import EtherscanLink from '~/components/EtherscanLink';
import { ContractDetailsQuery } from '~/queries/ContractDetails';
import { formatDate } from '~/utils/formatDate';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
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

  return (
    <Layout title="Contract">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Contract information</Typography>
          <Grid container={true}>
            <Grid item={true} xs={6} sm={6} md={4}>
              Address
            </Grid>
            <Grid item={true} xs={6} sm={6} md={8}>
              {contract && <EtherscanLink address={contract.id} />}
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
          </Grid>
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Contract);
