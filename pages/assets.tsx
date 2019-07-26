import React, { useState, useEffect } from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, NoSsr } from '@material-ui/core';
import Layout from '~/components/Layout';
import AssetList from '~/components/AssetList';
import axios from 'axios';

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
  const [rates, setRates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('https://coinapi.now.sh/?base=ETH');

      const r = { WETH: { rate: 1 } };
      result.data.rates.map(rate => {
        r[rate.asset_id_quote] = rate;
      });

      setRates(r);
    };

    fetchData();
  }, []);

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
