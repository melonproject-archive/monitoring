import React from 'react';
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

type NetworkProps = WithStyles<typeof styles>;

const Network: React.FunctionComponent<NetworkProps> = props => {
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
    .filter(item => item.validGav)
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
            Number of funds
          </Typography>
          {(result.loading && <CircularProgress />) || (
            <>
              <br />
              <Typography variant="body1">
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
              <Typography variant="body1">
                {melonNetworkHistories && melonNetworkHistories[melonNetworkHistories.length - 1].gav} ETH
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
              <Typography variant="body1">
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
              <Typography variant="body1">{amguPayments.length && formatThousands(amguSum)} amgu</Typography>
              <br />
              <TSAreaChart data={amguCumulative} dataKeys={['cumulativeAmount']} />
            </>
          )}
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Network);
