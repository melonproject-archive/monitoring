import { Grid, NoSsr, withStyles, WithStyles } from '@material-ui/core';
import React from 'react';
import AssetList from '~/components/AssetList';
import Layout from '~/components/Layout';
import { useRates } from '~/contexts/Rates/Rates';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

type AssetsProps = WithStyles<typeof styles>;

const Assets: React.FunctionComponent<AssetsProps> = () => {
  const rates = useRates();
  return (
    <Layout title="Asset Universe" page="assets">
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <AssetList rates={rates} />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Assets);
