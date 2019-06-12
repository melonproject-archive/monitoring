import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, NoSsr } from '@material-ui/core';
import Layout from '~/components/Layout';
import ExchangeList from '~/components/ExchangeList';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { ExchangeListScrapingQuery, ExchangeListQuery } from '~/queries/ExchangeListQuery';
import TradeList from '~/components/TradeList';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

type ExchangesProps = WithStyles<typeof styles>;

const Exchanges: React.FunctionComponent<ExchangesProps> = props => {
  const result = useScrapingQuery(
    [ExchangeListQuery, ExchangeListScrapingQuery],
    proceedPaths(['exchangeMethodCalls']),
    {
      ssr: false,
    },
  );

  const data = result.data || {};

  const exchanges = ((data && data.exchanges) || [])
    .map(exchange => {
      return {
        ...exchange,
        tradings: exchange.tradings.filter(t => t.fund),
      };
    })
    .filter(exchange => exchange.tradings.length);

  const trading = (data && data.exchangeMethodCalls) || [];

  return (
    <Layout title="Exchanges">
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <ExchangeList data={exchanges} loading={result.loading} />
        </NoSsr>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <TradeList data={trading} loading={result.loading} hideExchange={false} paging={true} />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Exchanges);
