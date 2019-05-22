import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import FundDetailsQuery from '~/queries/FundDetailsQuery';
import { useRouter } from 'next/router';

const styles: StyleRulesCallback = theme => ({});

type FundProps = WithStyles<typeof styles>;

const Fund: React.FunctionComponent<FundProps> = props => {
  const router = useRouter();
  const result = useQuery(FundDetailsQuery, {
    ssr: false,
    variables: {
      fund: router.query.address,
    },
  });

  const fund = result.data && result.data.fund;

  return (
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        {fund && (
          <>
            <div>Address: {fund.id}</div>
            <div>Name: {fund.name}</div>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Fund);
