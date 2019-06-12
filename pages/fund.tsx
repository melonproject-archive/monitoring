import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper, NoSsr } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { FundDetailsQuery } from '~/queries/FundDetailsQuery';
import { useRouter } from 'next/router';
import MaterialTable from 'material-table';
import { standardDeviation } from '../utils/finance';
import { formatDate } from '../utils/formatDate';
import Layout from '~/components/Layout';
import { formatBigNumber } from '~/utils/formatBigNumber';
import TimeSeriesChart from '~/components/TimeSeriesChart';
import BigNumber from 'bignumber.js';
import { hexToString } from '~/utils/hexToString';
import { sortBigNumber } from '~/utils/sortBigNumber';
import FundHoldingsChart from '~/components/FundHoldingsChart';
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

  const normalizedNumbers =
    (fund &&
      fund.calculationsHistory.map((item, index, array) => {
        const timeSpan = index > 0 ? item.timestamp - array[index - 1].timestamp : 0;
        const returnSinceLastPriceUpdate = index > 0 ? item.sharePrice / array[index - 1].sharePrice - 1 : 0;
        const dailyReturn = index > 0 ? Math.pow(1 + returnSinceLastPriceUpdate, (24 * 60 * 60) / timeSpan) - 1 : 0;
        return {
          ...item,
          sharePrice: item.sharePrice ? formatBigNumber(item.sharePrice) : 0,
          gav: item.gav ? formatBigNumber(item.gav, 18, 3) : 0,
          nav: item.nav ? formatBigNumber(item.nav, 18, 3) : 0,
          totalSupply: item.totalSupply ? formatBigNumber(item.totalSupply, 18, 3) : 0,
          dailyReturn: index > 0 ? dailyReturn : 0,
          logReturn: index > 0 ? Math.log(1 + dailyReturn) : 0,
          feesInDenominationAsset: item.feesInDenominationAsset ? formatBigNumber(item.feesInDenominationAsset) : 0,
        };
      })) ||
    [];

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

  return (
    <Layout title="Fund">
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">{fund && fund.name}&nbsp;</Typography>
          <div>Protocol version: {fund && hexToString(fund.version.name)}</div>
          <div>Address: {fund && fund.id}</div>
          <div>Manager: {fund && fund.manager.id}</div>
          <div>&nbsp;</div>
          <div>Created: {fund && formatDate(fund.createdAt)}</div>
          <div>
            Active: {fund && fund.isShutdown ? 'No' : 'Yes'}
            {fund && fund.isShutdown && <> (deactivated: {fund.shutdownAt && formatDate(fund.shutdownAt)})</>}
          </div>
          <div>&nbsp;</div>
          <div># shares: {fund && formatBigNumber(fund.totalSupply, 18, 3)}</div>
          <div>Share price: {fund && formatBigNumber(fund.sharePrice, 18, 3)}</div>
          <div>&nbsp;</div>
          <div>
            Management fee: {fund && formatBigNumber(fund.feeManager.managementFee.managementFeeRate + '00', 18, 2)}%
          </div>
          <div>
            Performance fee: {fund && formatBigNumber(fund.feeManager.performanceFee.performanceFeeRate + '00', 18, 2)}%
          </div>
          <div>
            Performance fee period: {fund && fund.feeManager.performanceFee.performanceFeePeriod / (60 * 60 * 24)} days
          </div>
          <div>&nbsp;</div>
          <div>Return since inception: {returnSinceInception && returnSinceInception.toFixed(2)}%</div>
          <div>Annualized return: {annualizedReturn && annualizedReturn.toFixed(2)}%</div>
          <div>Volatility: {volatility && volatility.toFixed(2)}%</div>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
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
                  return formatBigNumber(rowData.amount, 18, 3);
                },
              },
              {
                title: 'Price',
                type: 'numeric',
                render: rowData => {
                  const price = new BigNumber(rowData.assetGav)
                    .times(new BigNumber('1e18'))
                    .div(new BigNumber(rowData.amount))
                    .toString();
                  return formatBigNumber(price, 18, 3);
                },
              },
              {
                title: 'Value [ETH]',
                type: 'numeric',
                render: rowData => {
                  return formatBigNumber(rowData.assetGav, 18, 3);
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
          <TimeSeriesChart data={normalizedNumbers} dataKeys={['sharePrice']} loading={result.loading} />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Daily share price change (%)</Typography>

          <TimeSeriesChart
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
          <TimeSeriesChart data={normalizedNumbers} dataKeys={['gav', 'nav']} yMax={maxNav} loading={result.loading} />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5"># Shares</Typography>
          <TimeSeriesChart
            data={normalizedNumbers}
            dataKeys={['totalSupply']}
            yMax={maxSupply}
            loading={result.loading}
          />
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
          <TimeSeriesChart data={normalizedNumbers} dataKeys={['feesInDenominationAsset']} loading={result.loading} />
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
                  return formatBigNumber(rowData.shares, 18, 3);
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
    </Layout>
  );
};

export default withStyles(styles)(Fund);
