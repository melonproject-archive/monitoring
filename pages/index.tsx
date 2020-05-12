import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import * as Rx from 'rxjs';
import { Grid, withStyles, WithStyles, Typography, CircularProgress, Paper } from '@material-ui/core';
import { FundCountQuery, MelonNetworkHistoryQuery } from '~/queries/FundListQuery';
import Layout from '~/components/Layout';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import TSAreaChart from '~/components/TSAreaChart';
import { InvestorCountQuery, InvestmentCountQuery } from '~/queries/InvestorListQuery';
import { AmguPaymentsQuery, AmguConsumedQuery } from '~/queries/EngineDetailsQuery';
import { useQuery } from '@apollo/react-hooks';
import { formatThousands } from '~/utils/formatThousands';
import EtherscanLink from '~/components/EtherscanLink';
import { fetchEnsAddresses, EnsData } from '~/utils/ens';
import LineItem from '~/components/LineItem';
import { retryWhen, delay } from 'rxjs/operators';
import { useRates } from '~/contexts/Rates/Rates';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
  },
  logoDiv: {
    marginLeft: 'auto',
  },
});

type NetworkProps = WithStyles<typeof styles>;

const getEnsAddresses = () => {
  const [addresses, setAddresses] = useState<EnsData[]>();

  useEffect(() => {
    const addresses$ = Rx.defer(() => fetchEnsAddresses()).pipe(retryWhen((error) => error.pipe(delay(10000))));
    const subscription = addresses$.subscribe({
      next: (result) => setAddresses(result),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return addresses;
};

const Network: React.FunctionComponent<NetworkProps> = (props) => {
  const ens = getEnsAddresses();

  const rates = useRates();
  const fxRates = {
    MLNETH: rates?.MLN.ETH.toFixed(4),
    MLNUSD: rates?.MLN.USD.toFixed(4),
    ETHUSD: rates?.ETH.USD.toFixed(4),
  };

  const result = useScrapingQuery([FundCountQuery, FundCountQuery], proceedPaths(['fundCounts']), {
    ssr: false,
  });

  const fundCounts = R.pathOr([], ['data', 'fundCounts'], result);

  const historyResult = useScrapingQuery(
    [MelonNetworkHistoryQuery, MelonNetworkHistoryQuery],
    proceedPaths(['melonNetworkHistories']),
    {
      ssr: false,
    },
  );

  const melonNetworkHistories = R.pathOr([], ['data', 'melonNetworkHistories'], historyResult)
    .filter((item) => item.gav > 0)
    .map((item) => {
      return {
        ...item,
        gav: formatBigNumber(item.gav, 18, 0),
      };
    });

  const investmentResult = useScrapingQuery(
    [InvestmentCountQuery, InvestmentCountQuery],
    proceedPaths(['investorCounts']),
    {
      ssr: false,
    },
  );
  const investmentCounts = R.pathOr([], ['data', 'investmentCounts'], investmentResult);

  const investorResult = useScrapingQuery([InvestorCountQuery, InvestorCountQuery], proceedPaths(['investorCounts']), {
    ssr: false,
  });
  const investorCounts = R.pathOr([], ['data', 'investorCounts'], investorResult);

  const amguResult = useScrapingQuery([AmguPaymentsQuery, AmguPaymentsQuery], proceedPaths(['amguPayments']), {
    ssr: false,
  });

  const amguPayments = R.pathOr([], ['data', 'amguPayments'], amguResult);

  const amguCumulative: any[] = [];
  amguPayments.reduce((carry, item) => {
    amguCumulative.push({ ...item, cumulativeAmount: carry });
    return carry + parseInt(item.amount, 10);
  }, 0);

  const amguSumResult = useQuery(AmguConsumedQuery, { ssr: false });
  const amguSum = R.pathOr('', ['data', 'state', 'currentEngine', 'totalAmguConsumed'], amguSumResult);

  const amguPrice = R.pathOr(1, ['data', 'state', 'currentEngine', 'amguPrice'], amguSumResult) as number;
  const mlnSetupCosts = 17500000 * parseFloat(formatBigNumber(amguPrice, 18, 7));
  const setupCosts = {
    MLN: mlnSetupCosts.toFixed(4),
    ETH: (mlnSetupCosts * rates?.MLN.ETH).toFixed(4),
    USD: (mlnSetupCosts * rates?.MLN.USD).toFixed(4),
  };

  const ethAum = melonNetworkHistories.length && melonNetworkHistories[melonNetworkHistories.length - 1].gav;
  const usdAum = formatThousands((ethAum * rates?.ETH.USD).toFixed(0));

  return (
    <Layout title="Network overview" page="/">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <div className={props.classes.logoBox}>
            <Typography variant="body1">
              Melon network monitoring tool - your friendly companion into the Melon ecosystem
            </Typography>
            <div className={props.classes.logoDiv}>
              <img src="/static/icon.png" alt="MLN logo" width="50" height="50" />
            </div>
          </div>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5" component="h2">
            Exchange rates
          </Typography>
          <Typography variant="body1" align="right">
            {fxRates.MLNETH} MLN/ETH
            <br />
            {fxRates.MLNUSD} MLN/USD
            <br />
            {fxRates.ETHUSD} ETH/USD
          </Typography>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5" component="h2">
            Estimated setup costs
          </Typography>
          <Typography variant="body1" align="right">
            {setupCosts.MLN} MLN
            <br />
            {setupCosts.ETH} ETH
            <br />
            {setupCosts.USD} USD
          </Typography>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5" component="h2">
            Number of funds
          </Typography>
          {(result.loading && <CircularProgress />) || (
            <>
              <br />
              <Typography variant="body1" align="right">
                {fundCounts &&
                  parseInt(fundCounts[fundCounts.length - 1].active, 10) +
                    parseInt(fundCounts[fundCounts.length - 1].nonActive, 10)}{' '}
                funds
              </Typography>
              <br />
              <TSAreaChart data={fundCounts} dataKeys={['active', 'nonActive']} />
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5" component="h2">
            Total assets under management
          </Typography>
          {(historyResult.loading && <CircularProgress />) || (
            <>
              <br />
              <Typography variant="body1" align="right">
                {ethAum} ETH / {usdAum} USD
              </Typography>
              <br />
              <TSAreaChart data={melonNetworkHistories} dataKeys={['gav']} />
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Investments</Typography>
          {(historyResult.loading && <CircularProgress />) || (
            <>
              <br />
              <Typography variant="body1" align="right">
                {investmentCounts.length && investmentCounts[investmentCounts.length - 1].all} investments
              </Typography>
              <br />
              <TSAreaChart data={investmentCounts} dataKeys={['all', 'active', 'nonActive']} />
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Investors</Typography>
          {(historyResult.loading && <CircularProgress />) || (
            <>
              <br />
              <Typography variant="body1" align="right">
                {investorCounts.length &&
                  parseInt(investorCounts[investorCounts.length - 1].active, 10) +
                    parseInt(investorCounts[investorCounts.length - 1].nonActive, 10)}{' '}
                investors
              </Typography>
              <br />
              <TSAreaChart data={investorCounts} dataKeys={['active', 'nonActive']} />
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Amgu consumed</Typography>
          {(amguResult.loading && <CircularProgress />) || (
            <>
              <br />
              <Typography variant="body1" align="right">
                {amguPayments.length && formatThousands(amguSum)} amgu
              </Typography>
              <br />
              <TSAreaChart data={amguCumulative} dataKeys={['cumulativeAmount']} />
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Contract addresses</Typography>
          <br />
          <Grid container={true}>
            {ens?.map((a) => {
              return (
                <LineItem name={a.ens} key={a.ens}>
                  <EtherscanLink address={a.address} />
                </LineItem>
              );
            })}
          </Grid>
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Network);
