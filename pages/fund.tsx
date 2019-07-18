import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper, NoSsr, Tooltip } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { FundDetailsQuery, FundCalculationsHistoryQuery } from '~/queries/FundDetailsQuery';
import { useRouter } from 'next/router';
import MaterialTable from 'material-table';
import { standardDeviation } from '../utils/finance';
import { formatDate } from '../utils/formatDate';
import Layout from '~/components/Layout';
import { formatBigNumber } from '~/utils/formatBigNumber';
import BigNumber from 'bignumber.js';
import { hexToString } from '~/utils/hexToString';
import { sortBigNumber } from '~/utils/sortBigNumber';
import FundHoldingsChart from '~/components/FundHoldingsChart';
import TradeList from '~/components/TradeList';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import EtherscanLink from '~/components/EtherscanLink';
import TSLineChart from '~/components/TSLineChart';
import TooltipNumber from '~/components/TooltipNumber';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

type FundProps = WithStyles<typeof styles>;

const Fund: React.FunctionComponent<FundProps> = props => {
  const router = useRouter();
  const result = useQuery(FundDetailsQuery, {
    ssr: false,
    skip: !(router && router.query.address),
    variables: {
      fund: router && router.query.address,
    },
  });

  const fund = R.pathOr(undefined, ['data', 'fund'], result);
  const assets = R.pathOr([], ['data', 'assets'], result);

  const calculationsResult = useScrapingQuery(
    [FundCalculationsHistoryQuery, FundCalculationsHistoryQuery],
    proceedPaths(['fundCalculationsHistories']),
    {
      ssr: false,
      skip: !(router && router.query.address),
      variables: {
        fund: router && router.query.address,
      },
    },
  );

  const normalizedNumbers = R.pathOr([], ['data', 'fundCalculationsHistories'], calculationsResult).map(
    (item, index, array) => {
      const timeSpan = index > 0 ? item.timestamp - array[index - 1].timestamp : 0;
      const returnSinceLastPriceUpdate = index > 0 ? item.sharePrice / array[index - 1].sharePrice - 1 : 0;
      let dailyReturn = index > 0 ? Math.pow(1 + returnSinceLastPriceUpdate, (24 * 60 * 60) / timeSpan) - 1 : 0;
      if (dailyReturn > 100 || dailyReturn <= -1) {
        dailyReturn = undefined;
      }
      return {
        ...item,
        sharePrice: item.sharePrice && formatBigNumber(item.sharePrice, 18, 6),
        gav: item.gav ? formatBigNumber(item.gav, 18, 6) : 0,
        nav: item.nav ? formatBigNumber(item.nav, 18, 6) : 0,
        totalSupply: item.totalSupply ? formatBigNumber(item.totalSupply, 18, 3) : 0,
        dailyReturn: index > 0 ? (dailyReturn * 100).toFixed(2) : 0,
        logReturn: index > 0 ? Math.log(1 + dailyReturn) : 0,
        feesInDenominationAsset: item.feesInDenominationAsset
          ? formatBigNumber(item.feesInDenominationAsset, 18, 6)
          : 0,
      };
    },
  );

  const maxSharePrice = Math.max(...normalizedNumbers.map(item => item.sharePrice));
  const minSharePrice = Math.min(...normalizedNumbers.map(item => item.sharePrice));

  const maxNav = Math.max(...normalizedNumbers.map(item => item.nav), 0);
  const maxGav = Math.max(...normalizedNumbers.map(item => item.gav), 0);
  const maxSupply = Math.max(...normalizedNumbers.map(item => item.totalSupply), 0);

  const returnSinceInception =
    normalizedNumbers &&
    normalizedNumbers.length > 0 &&
    (normalizedNumbers[normalizedNumbers.length - 1].sharePrice / normalizedNumbers[0].sharePrice - 1) * 100;
  const annualizedReturn =
    returnSinceInception &&
    normalizedNumbers &&
    (Math.pow(
      1 + returnSinceInception / 100,
      (60 * 60 * 24 * 365.25) /
        (normalizedNumbers[normalizedNumbers.length - 1].timestamp - normalizedNumbers[0].timestamp),
    ) -
      1) *
      100;

  const volatility =
    normalizedNumbers && standardDeviation(normalizedNumbers.map(item => item.logReturn)) * 100 * Math.sqrt(365.25);

  const investmentHistory = fund && fund.investmentHistory;

  const currentHoldings =
    fund &&
    fund.currentHoldings.filter(
      (holding, index, array) => holding.timestamp === array[0].timestamp && !new BigNumber(holding.amount).isZero(),
    );

  const investments = fund && fund.investments;

  const feesPaidOut = R.pathOr([], ['feeManager', 'feeRewardHistory'], fund);

  const policies = fund && fund.policyManager && fund.policyManager.policies;

  const contractNames = [
    { name: 'Accounting', field: 'accounting' },
    { name: 'FeeManager', field: 'feeManager' },
    { name: 'Participation', field: 'participation' },
    { name: 'PolicyManager', field: 'policyManager' },
    { name: 'Shares', field: 'share' },
    { name: 'Trading', field: 'trading' },
    { name: 'Vault', field: 'vault' },
  ];

  const contractAddresses =
    fund &&
    contractNames.map(contract => {
      return { ...contract, address: fund[contract.field] && fund[contract.field].id };
    });

  const investmentRequests = R.pathOr([], ['data', 'investmentRequests'], result).map(item => {
    let expires = parseInt(item.requestTimestamp, 10) + 24 * 60 * 60;
    let status = item.status;
    if (new Date().getTime() > new Date(expires * 1000).getTime()) {
      status = 'EXPIRED';
      expires = undefined;
    }
    return {
      ...item,
      status,
      expires,
    };
  });

  return (
    <Layout title="Fund">
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">{fund && fund.name}&nbsp;</Typography>
          <br />
          <Grid container={true}>
            <Grid item={true} xs={4} sm={4} md={4}>
              Protocol&nbsp;version
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {fund && hexToString(fund.version.name)}
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Address
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              <EtherscanLink address={fund && fund.id} />
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Manager
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              <EtherscanLink address={fund && fund.manager.id} />
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Created
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {fund && formatDate(fund.createdAt, true)}
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Active
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {fund && fund.isShutdown ? 'No' : 'Yes'}
              {fund && fund.isShutdown && <> (deactivated: {fund.shutdownAt && formatDate(fund.shutdownAt)})</>}
              <div>&nbsp;</div>
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              GAV
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {fund && <TooltipNumber number={fund.gav} />}
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              NAV
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {fund && <TooltipNumber number={fund.nav} />}
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              #&nbsp;shares
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {fund && <TooltipNumber number={fund.totalSupply} />}
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Share&nbsp;price
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {fund && <TooltipNumber number={fund.sharePrice} />}
              <div>&nbsp;</div>
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Management&nbsp;fee
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {fund && formatBigNumber(fund.feeManager.managementFee.managementFeeRate + '00', 18, 2)}%
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Performance&nbsp;fee
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {fund && formatBigNumber(fund.feeManager.performanceFee.performanceFeeRate + '00', 18, 2)}%{' '}
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Performance&nbsp;fee&nbsp;period
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {fund && fund.feeManager.performanceFee.performanceFeePeriod / (60 * 60 * 24)} days <div>&nbsp;</div>
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Return since inception
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {returnSinceInception && returnSinceInception.toFixed(2)}%{' '}
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Annualized return{' '}
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {annualizedReturn && annualizedReturn.toFixed(2)}%{' '}
            </Grid>
            <Grid item={true} xs={4} sm={4} md={4}>
              Volatility
            </Grid>
            <Grid item={true} xs={8} sm={8} md={8}>
              {volatility && volatility.toFixed(2)}%{' '}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Asset',
                field: 'asset.symbol',
              },
              {
                title: 'Amount',
                type: 'numeric',
                render: rowData => {
                  return (
                    <Tooltip title={formatBigNumber(rowData.amount, rowData.asset.decimals, 18)}>
                      <span>{formatBigNumber(rowData.amount, rowData.asset.decimals, 4)}</span>
                    </Tooltip>
                  );
                },
              },
              // {
              //   title: 'Price',
              //   type: 'numeric',
              //   render: rowData => {
              //     console.log(rowData);
              //     const price = new BigNumber(rowData.assetGav)
              //       .times(new BigNumber('1e18'))
              //       .div(new BigNumber(rowData.amount))
              //       .toString();
              //     return formatBigNumber(price, 18, 3);
              //   },
              // },
              {
                title: 'Value [ETH]',
                type: 'numeric',
                render: rowData => {
                  return (
                    <Tooltip title={formatBigNumber(rowData.assetGav, 18, 18)}>
                      <span>{formatBigNumber(rowData.assetGav, 18, 4)}</span>
                    </Tooltip>
                  );
                },
                defaultSort: 'desc',
                customSort: (a, b) => sortBigNumber(a, b, 'assetGav'),
              },
            ]}
            data={currentHoldings}
            title="Assets in portfolio"
            options={{
              paging: false,
              search: false,
            }}
            isLoading={result.loading}
            onRowClick={(_, rowData) => {
              const url = '/asset?address=' + rowData.asset.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Share Price</Typography>
          <TSLineChart
            data={normalizedNumbers}
            dataKeys={['sharePrice']}
            yMax={maxSharePrice}
            yMin={minSharePrice}
            loading={result.loading}
          />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Daily share price change (%)</Typography>

          <TSLineChart
            data={normalizedNumbers}
            dataKeys={['dailyReturn']}
            referenceLine={true}
            loading={result.loading}
          />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">NAV</Typography>
          <TSLineChart data={normalizedNumbers} dataKeys={['nav', 'gav']} yMax={maxNav} loading={result.loading} />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5"># Shares</Typography>
          <TSLineChart data={normalizedNumbers} dataKeys={['totalSupply']} yMax={maxSupply} loading={result.loading} />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fund holdings</Typography>
          <FundHoldingsChart
            fundAddres={router && router.query.address}
            assets={assets.map(item => item.symbol)}
            yMax={fund && maxGav}
          />
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fees in denomination asset</Typography>
          <TSLineChart data={normalizedNumbers} dataKeys={['feesInDenominationAsset']} loading={result.loading} />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Time',
                field: 'timestamp',
                render: rowData => {
                  return formatDate(rowData.timestamp);
                },
              },
              {
                title: 'Investor',
                field: 'owner.id',
              },
              {
                title: 'Action',
                field: 'action',
              },
              {
                title: 'Shares',
                render: rowData => {
                  return formatBigNumber(rowData.shares, 18, 3);
                },
                type: 'numeric',
              },
              {
                title: 'Share Price',
                render: rowData => {
                  return formatBigNumber(rowData.sharePrice, 18, 3);
                },
                type: 'numeric',
              },
              {
                title: 'Amount in ETH',
                render: rowData => {
                  return formatBigNumber(rowData.amountInDenominationAsset, 18, 3);
                },
                type: 'numeric',
              },
            ]}
            data={investmentHistory}
            title="Investment History"
            options={{
              paging: false,
              search: false,
            }}
            isLoading={result.loading}
            onRowClick={(_, rowData) => {
              const url = '/investor?address=' + rowData.owner.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Investor',
                field: 'owner.id',
              },
              {
                title: 'Shares',
                render: rowData => {
                  return formatBigNumber(rowData.shares, 18, 3);
                },
                type: 'numeric',
              },
            ]}
            data={investments}
            title="Investors"
            options={{
              paging: false,
              search: false,
            }}
            isLoading={result.loading}
            onRowClick={(_, rowData) => {
              const url = '/investor?address=' + rowData.owner.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Time',
                render: rowData => {
                  return formatDate(rowData.timestamp);
                },
              },
              {
                title: 'Shares',
                type: 'numeric',
                render: rowData => {
                  return formatBigNumber(rowData.shares, 18, 6);
                },
              },
            ]}
            data={feesPaidOut}
            title="Fees paid out"
            isLoading={result.loading}
            options={{
              paging: false,
              search: false,
            }}
          />
        </NoSsr>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Policy',
                field: 'identifier',
              },
              {
                title: 'Parameters',
                type: 'numeric',
                render: rowData => {
                  switch (rowData.identifier) {
                    case 'Max concentration':
                      return formatBigNumber(rowData.maxConcentration + '00', 18, 0) + '%';
                    case 'Price tolerance':
                      return formatBigNumber(rowData.priceTolerance + '00', 18, 0) + '%';
                    case 'Max positions':
                      return rowData.maxPositions;
                    case 'Asset whitelist':
                      return rowData.assetWhiteList
                        .map(asset => asset.symbol)
                        .sort()
                        .join(', ');
                  }
                },
              },
            ]}
            data={policies}
            title="Risk management &amp; compliance policies"
            isLoading={result.loading}
            options={{
              paging: false,
              search: false,
            }}
          />
        </NoSsr>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Contract',
                field: 'name',
              },
              {
                title: 'Address',
                field: 'address',
                render: rowData => {
                  return <EtherscanLink address={rowData.address} />;
                },
              },
            ]}
            data={contractAddresses}
            title="Contract addresses"
            isLoading={result.loading}
            options={{
              paging: false,
              search: false,
            }}
          />
        </NoSsr>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <TradeList
            data={fund && fund.trading.calls}
            loading={result.loading}
            hideFund={true}
            hideExchange={false}
            linkFile="exchange"
            linkPath={['exchange', 'id']}
          />
        </NoSsr>
      </Grid>
      {investmentRequests && (
        <Grid item={true} xs={12}>
          <NoSsr>
            <MaterialTable
              columns={[
                {
                  title: 'Date',
                  render: rowData => {
                    return formatDate(rowData.requestTimestamp, true);
                  },
                },
                {
                  title: 'Investor',
                  field: 'owner.id',
                },
                {
                  title: 'Shares',
                  render: rowData => {
                    return formatBigNumber(rowData.shares, 18, 3);
                  },
                  type: 'numeric',
                },
                {
                  title: 'Amount',
                  render: rowData => {
                    return formatBigNumber(rowData.amount, rowData.asset.decimals, 3);
                  },
                  type: 'numeric',
                },
                {
                  title: 'Asset',
                  field: 'asset.symbol',
                },
                {
                  title: 'Status',
                  field: 'status',
                },
                {
                  title: 'Expires',
                  render: rowData => {
                    return rowData.expires && formatDate(rowData.expires, true);
                  },
                },
              ]}
              data={investmentRequests}
              title="Pending investments"
              options={{
                paging: false,
                search: false,
              }}
              isLoading={result.loading}
              onRowClick={(_, rowData) => {
                const url = '/investor?address=' + rowData.owner.id;
                window.open(url, '_self');
              }}
            />
          </NoSsr>
        </Grid>
      )}
    </Layout>
  );
};

export default withStyles(styles)(Fund);
