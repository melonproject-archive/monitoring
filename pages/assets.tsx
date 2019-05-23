import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Link, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import AssetsQuery from '~/queries/AssetsQuery';

const styles: StyleRulesCallback = theme => ({});

type AssetProps = WithStyles<typeof styles>;

const Assets: React.FunctionComponent<AssetProps> = props => {
  const result = useQuery(AssetsQuery, {
    ssr: false,
  });

  const assets = (result.data && result.data.assets) || [];

  return (
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        <Typography variant="h5">Asset list</Typography>

        {assets.map(item => (
          <div key={item.id}>
            <Link href={`/asset?address=${item.id}`}>
              <a>{item.symbol}</a>
            </Link>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Assets);
