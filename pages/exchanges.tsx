import React from 'react';
import { Grid, withStyles, WithStyles, NoSsr } from '@material-ui/core';
import Layout from '~/components/Layout';
import ExchangeList from '~/components/ExchangeList';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { ExchangeListQuery, ExchangeMethodCallListQuery, TradeListQuery } from '~/queries/ExchangeListQuery';
import ExchangeCallList from '~/components/ExchangeCallList';
import { useQuery } from '@apollo/react-hooks';
import TradeList from '~/components/TradeList';

const styles = theme => ({
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
  const result = useQuery(ExchangeListQuery, {
    ssr: false,
  });

  const data = result.data || {};

  const exchanges = ((data && data.exchanges) || [])
    .map(exchange => {
      return {
        ...exchange,
        tradings: exchange.tradings.filter(t => t.fund),
      };
    })
    .filter(exchange => exchange.tradings.length);

  const exchangeMethodCallResult = useScrapingQuery(
    [ExchangeMethodCallListQuery, ExchangeMethodCallListQuery],
    proceedPaths(['exchangeMethodCalls']),
    {
      ssr: false,
    },
  );

  const tradeResult = useScrapingQuery([TradeListQuery, TradeListQuery], proceedPaths(['trades']), {
    ssr: false,
  });

  const trading = (exchangeMethodCallResult.data && exchangeMethodCallResult.data.exchangeMethodCalls) || [];
  const trades = (tradeResult.data && tradeResult.data.trades) || [];

  return (
    <Layout title="Exchanges" page="exchanges">
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <ExchangeList data={exchanges} loading={result.loading} />
        </NoSsr>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <NoSsr>
          <ExchangeCallList data={trading} loading={result.loading} hideExchange={false} paging={true} />
        </NoSsr>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <NoSsr>
          <TradeList data={trades} loading={result.loading} hideExchange={false} paging={true} />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Exchanges);
