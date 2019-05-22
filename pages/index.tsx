import React from 'react';
import Link from 'next/link';
import { Grid, withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import FundOverviewQuery from '~/queries/FundOverviewQuery';

const styles: StyleRulesCallback = theme => ({});

const Home: React.FunctionComponent<WithStyles<typeof styles>> = props => {
  const result = useQuery(FundOverviewQuery, {
    ssr: false,
  });

  const funds = (result.data && result.data.funds) || [];

  return (
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        {funds.map(item => (
          <div key={item.id}>
            <Link href={`/fund?address=${item.id}`}>
              <a>{item.name}</a>
            </Link>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Home);
