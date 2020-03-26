import React from 'react';
import { Grid, withStyles, WithStyles, Typography, Paper, NoSsr } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import Layout from '~/components/Layout';
import ExchangeDetailsQuery from '~/queries/ExchangeDetailsQuery';
import EtherscanLink from '~/components/EtherscanLink';
import TradeList from '~/components/TradeList';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type ExchangeProps = WithStyles<typeof styles>;

const Exchange: React.FunctionComponent<ExchangeProps> = (props) => {
  const router = useRouter();
  const result = useQuery(ExchangeDetailsQuery, {
    ssr: false,
    skip: !(router && router.query.address),
    variables: {
      exchange: router && router.query.address,
    },
  });

  const exchange = result.data && result.data.exchange;

  const trades = exchange?.trades;

  return (
    <Layout title="Exchange" page="exchange">
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">{exchange && exchange.name}&nbsp;</Typography>
          <div>
            Address: <EtherscanLink address={exchange && exchange.id} />
          </div>
          <div>
            Adapter: <EtherscanLink address={exchange && exchange.adapter.id} />
          </div>
          <div>Takes custody: {exchange && (exchange.adapter.takesCustody ? 'Yes' : 'No')}</div>

          <div>&nbsp;</div>
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <TradeList data={trades} loading={result.loading} hideExchange={false} paging={true} />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Exchange);
