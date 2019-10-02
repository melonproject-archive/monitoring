import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import {
  Grid,
  withStyles,
  WithStyles,
  StyleRulesCallback,
  Typography,
  CircularProgress,
  Paper,
} from '@material-ui/core';
import { FundCountQuery, MelonNetworkHistoryQuery } from '~/queries/FundListQuery';
import Layout from '~/components/Layout';
import { formatBigNumber } from '~/utils/formatBigNumber';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import TSAreaChart from '~/components/TSAreaChart';
import { InvestorCountQuery } from '~/queries/InvestorListQuery';
import { AmguPaymentsQuery, AmguConsumedQuery } from '~/queries/EngineDetailsQuery';
import { useQuery } from '@apollo/react-hooks';
import { formatThousands } from '~/utils/formatThousands';
import { fetchSingleCoinApiRate, fetchCoinApiRates } from '~/utils/coinApi';
import Eth from 'web3-eth';
import EtherscanLink from '~/components/EtherscanLink';

const styles: StyleRulesCallback = theme => ({
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

const eth = new Eth(Eth.givenProvider || 'https://mainnet.melonport.com');

type NetworkProps = WithStyles<typeof styles>;

const getEthUsdRate = () => {
  const [rate, setRate] = useState({ rate: 1 });

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetchSingleCoinApiRate();
      setRate(r);
    };

    fetchData();
  }, []);
  return rate;
};

const getMlnRates = () => {
  const [rates, setRate] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetchCoinApiRates('MLN');
      setRate(r);
    };

    fetchData();
  }, []);
  return rates;
};

const getEnsAddresses = () => {
  const names = [
    'melontoken',
    'version',
    'registry',
    'fundfactory',
    'kyberpricefeed',
    'engine',
    'engineadapter',
    'ethfinexadapter',
    'kyberadapter',
    'matchingmarketadapter',
    'zeroexv2adapter',
    'fundranking',
    'managementfee',
    'performancefee',
  ];

  const [addresses, setAddresses] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const adr = await Promise.all(
        names.map(async name => {
          const ens = `${name}.melonprotocol.eth`;

          return {
            ens,
            address: (await eth.ens.getAddress(ens)).toLowerCase(),
          };
        }),
      );
      setAddresses(adr);
    };
    fetchData();
  }, []);
  return addresses;
};

const Network: React.FunctionComponent<NetworkProps> = props => {
  const ethUsdRate = getEthUsdRate();
  const mlnRates = getMlnRates();

  const ens = getEnsAddresses();

  const fxRates = {
    MLNETH: mlnRates && mlnRates.ETH.rate.toFixed(4),
    MLNUSD: mlnRates && mlnRates.USD && mlnRates.USD.rate.toFixed(4),
    ETHUSD: ethUsdRate && ethUsdRate.rate.toFixed(4),
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
    // .filter(item => item.validGav)
    .map(item => {
      return {
        ...item,
        gav: formatBigNumber(item.gav, 18, 0),
      };
    });

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
    ETH: mlnRates && mlnRates.ETH && (mlnSetupCosts * mlnRates.ETH.rate).toFixed(4),
    USD: mlnRates && mlnRates.USD && (mlnSetupCosts * mlnRates.USD.rate).toFixed(4),
  };

  const ethAum = melonNetworkHistories.length && melonNetworkHistories[melonNetworkHistories.length - 1].gav;
  const usdAum = formatThousands((ethAum && ethAum * ethUsdRate.rate).toFixed(0));

  return (
    <Layout title="Network overview" page="/">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <div className={props.classes.logoBox}>
            <Typography variant="body1">
              Melon network monitoring tool - your friendly companion into the Melon ecosystem
            </Typography>
            <div className={props.classes.logoDiv}>
              <img
                src="https://github.com/melonproject/branding/raw/master/melon/11_Melon_icon.png"
                alt="MLN logo"
                width="50"
                height="50"
              />
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
                funds ({fundCounts[fundCounts.length - 1].active} active,{' '}
                {fundCounts && fundCounts[fundCounts.length - 1].nonActive} not active)
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
          <Typography variant="h5">Investors</Typography>
          {(historyResult.loading && <CircularProgress />) || (
            <>
              <br />
              <Typography variant="body1" align="right">
                {investorCounts.length && investorCounts[investorCounts.length - 1].numberOfInvestors} investors
              </Typography>
              <br />
              <TSAreaChart data={investorCounts} dataKeys={['numberOfInvestors']} />
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
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Contract addresses</Typography>
          <br />
          <Grid container={true}>
            {ens &&
              ens.map(a => {
                return (
                  <>
                    <Grid item={true} xs={6} sm={6} md={4} key={a.ens}>
                      {a.ens}
                    </Grid>
                    <Grid item={true} xs={6} sm={6} md={8} className={props.classes.truncate} key={a.address}>
                      <EtherscanLink address={a.address} />
                    </Grid>
                  </>
                );
              })}
          </Grid>
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Network);
