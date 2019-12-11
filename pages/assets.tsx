import React, { useState, useEffect } from 'react';
import * as Rx from 'rxjs';
import { Grid, withStyles, WithStyles, NoSsr } from '@material-ui/core';
import Layout from '~/components/Layout';
import AssetList from '~/components/AssetList';
import { fetchCoinApiRates } from '~/utils/coinApi';
import { retryWhen, delay } from 'rxjs/operators';

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

type AssetsProps = WithStyles<typeof styles>;

const getRates = () => {
  const [rates, setRates] = useState({});

  useEffect(() => {
    const rates$ = Rx.defer(() => fetchCoinApiRates()).pipe(retryWhen(error => error.pipe(delay(10000))));
    const subscription = rates$.subscribe({
      next: result => setRates(result),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return rates;
};

const Assets: React.FunctionComponent<AssetsProps> = props => {
  const rates = getRates();
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
