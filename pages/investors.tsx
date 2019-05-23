import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Link } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import InvestorsQuery from '~/queries/InvestorsQuery';

const styles: StyleRulesCallback = theme => ({});

type InvestorsProps = WithStyles<typeof styles>;

const Investors: React.FunctionComponent<InvestorsProps> = props => {
  const result = useQuery(InvestorsQuery, {
    ssr: false,
  });

  const assets = (result.data && result.data.investors) || [];

  return (
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        {assets.map(item => (
          <div key={item.id}>
            <Link href={`/investor?address=${item.id}`}>
              <a>{item.id}</a>
            </Link>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Investors);
