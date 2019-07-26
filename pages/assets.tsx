import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, NoSsr } from '@material-ui/core';
import Layout from '~/components/Layout';
import AssetList from '~/components/AssetList';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

type AssetsProps = WithStyles<typeof styles>;

const Assets: React.FunctionComponent<AssetsProps> = props => {
  return (
    <Layout title="Asset Universe" page="assets">
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <AssetList />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Assets);
