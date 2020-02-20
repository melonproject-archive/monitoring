import React from 'react';
import * as R from 'ramda';
import { Grid, withStyles, WithStyles, Typography, Paper, NoSsr, Link } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { FundDetailsQuery, FundCalculationsHistoryQuery } from '~/queries/FundDetailsQuery';
import { useRouter } from 'next/router';
import MaterialTable from 'material-table';
import { standardDeviation } from '../utils/finance';
import { formatDate } from '../utils/formatDate';
import Layout from '~/components/Layout';
import { formatBigNumber } from '~/utils/formatBigNumber';
import BigNumber from 'bignumber.js';
import { sortBigNumber } from '~/utils/sortBigNumber';
import FundHoldingsChart from '~/components/FundHoldingsChart';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import EtherscanLink from '~/components/EtherscanLink';
import TSLineChart from '~/components/TSLineChart';
import TooltipNumber from '~/components/TooltipNumber';
import TradeList from '~/components/TradeList';
import EventList from '~/components/EventList';
import LineItem from '~/components/LineItem';
import ShortAddress from '~/components/ShortAddress';

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
  debug: {
    color: '#777',
    fontSize: '9px',
  },
  // truncate: {
  //   width: '250px',
  //   whiteSpace: 'nowrap',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  // },
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

  const debugLink = router && '/fund?address=' + router.query.address + '&debug=1';

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
      const returnSinceLastPriceUpdate = index > 0 ? item.sharePrice / array[index - 1].sharePrice - 1 : 0;
      // const timeSpan = index > 0 ? item.timestamp - array[index - 1].timestamp : 0;
      // let dailyReturn = index > 0 ? Math.pow(1 + returnSinceLastPriceUpdate, (24 * 60 * 60) / timeSpan) - 1 : 0;
      let dailyReturn = returnSinceLastPriceUpdate;
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

  const numbersLength = R.propOr(0, 'length', normalizedNumbers) as number;
  const firstChange = R.head(normalizedNumbers) as any;
  const afterChange = R.path([numbersLength - 1], normalizedNumbers) as any;
  const beforeChange = R.path([numbersLength - 2], normalizedNumbers) as any;

  const lastSharePriceChange = afterChange && beforeChange ? afterChange.sharePrice - beforeChange.sharePrice : null;
  const lastReturn = afterChange ? afterChange.dailyReturn : null;
  const sharePriceChangeColor = lastReturn > 0 ? 'secondary' : lastReturn < 0 ? 'error' : 'primary';

  const secondsNow = new Date().valueOf() / 1000;
  const timeSinceInit = fund && secondsNow - fund.feeManager.performanceFee.initializeTime;
  const secondsSinceLastPeriod = fund && timeSinceInit % fund.feeManager.performanceFee.performanceFeePeriod;
  const nextPeriodStart =
    fund && secondsNow + (fund.feeManager.performanceFee.performanceFeePeriod - secondsSinceLastPeriod);

  const maxSharePrice = Math.max(...normalizedNumbers.map(item => item.sharePrice));
  const minSharePrice = Math.min(...normalizedNumbers.map(item => item.sharePrice));

  const maxNav = Math.max(...normalizedNumbers.map(item => item.nav), 0);
  const maxGav = Math.max(...normalizedNumbers.map(item => item.gav), 0);
  // const maxSupply = Math.max(...normalizedNumbers.map(item => item.totalSupply), 0);

  const returnSinceInception =
    firstChange && afterChange ? (afterChange.sharePrice / firstChange.sharePrice - 1) * 100 : null;
  const annualizedReturn =
    returnSinceInception &&
    normalizedNumbers &&
    (Math.pow(
      1 + returnSinceInception / 100,
      (60 * 60 * 24 * 365.25) / (afterChange.timestamp - firstChange.timestamp),
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

  const policies =
    fund &&
    fund.policyManager &&
    fund.policyManager.policies.map(policy => {
      const category =
        policy.identifier === 'UserWhitelist' || policy.identifier === 'UserBlackList'
          ? 'Compliance'
          : 'Risk Management';
      return { ...policy, category };
    });

  const contractNames = [
    { name: 'Accounting', field: 'accounting' },
    { name: 'FeeManager', field: 'feeManager' },
    { name: 'Participation', field: 'participation' },
    { name: 'PolicyManager', field: 'policyManager' },
    { name: 'Shares', field: 'share' },
    { name: 'Trading', field: 'trading' },
    { name: 'Vault', field: 'vault' },
    { name: 'Registry', field: 'registry' },
    { name: 'Version', field: 'version' },
    { name: 'PriceSource', field: 'priceSource' },
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
    <Layout title="Fund" page="fund">
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fund Factsheet</Typography>
          <br />
          <Grid container={true}>
            <LineItem name="Fund name">{fund && fund.name}</LineItem>
            <LineItem name="Protocol version">{fund && fund.version.name}</LineItem>
            <LineItem name="Fund address">
              <EtherscanLink address={fund && fund.id} />
            </LineItem>
            <LineItem name="Manager address">
              <EtherscanLink address={fund && fund.manager.id} />
            </LineItem>
            <LineItem name="Inception">{fund && formatDate(fund.createdAt, true)}</LineItem>
            <LineItem name="Status">
              {fund && fund.isShutdown ? 'Inactive' : 'Active'}
              {fund && fund.isShutdown && <> (deactivated: {fund.shutdownAt && formatDate(fund.shutdownAt)})</>}
              <div>&nbsp;</div>
            </LineItem>
            <LineItem name="GAV">{fund && <TooltipNumber number={fund.gav} />} ETH</LineItem>
            <LineItem name="NAV">{fund && <TooltipNumber number={fund.nav} />} ETH</LineItem>
            <LineItem name="# shares">{fund && <TooltipNumber number={fund.totalSupply} />} shares</LineItem>
            <LineItem name="Share price">
              {fund && <TooltipNumber number={fund.sharePrice} />}{' '}
              <Typography variant="caption" color={sharePriceChangeColor}>
                {lastSharePriceChange && lastSharePriceChange > 0 && '+'}
                {lastSharePriceChange && lastSharePriceChange.toFixed(4)} ({lastReturn && lastReturn > 0 && '+'}
                {lastReturn}%)
              </Typography>
              <div>&nbsp;</div>
            </LineItem>

            <LineItem name="Management fee">
              {fund && formatBigNumber(fund.feeManager.managementFee.managementFeeRate + '00', 18, 2)}%
            </LineItem>
            <LineItem name="Performance fee">
              {fund && formatBigNumber(fund.feeManager.performanceFee.performanceFeeRate + '00', 18, 2)}%{' '}
            </LineItem>
            <LineItem name="Performance fee period">
              {fund && fund.feeManager.performanceFee.performanceFeePeriod / (60 * 60 * 24)} days
            </LineItem>
            <LineItem name="Start of next perfomance fee period">
              {nextPeriodStart && formatDate(nextPeriodStart, true)}
              <div>&nbsp;</div>
            </LineItem>

            <LineItem name="Return since inception">
              {returnSinceInception && returnSinceInception.toFixed(2)}%
            </LineItem>
            <LineItem name="Annualized return">{annualizedReturn && annualizedReturn.toFixed(2)}%</LineItem>
            <LineItem name="Annual volatility">
              {volatility && volatility.toFixed(2)}%<div>&nbsp;</div>
            </LineItem>
            <LineItem name="Authorized exchanges">
              {fund &&
                fund.trading.exchanges
                  .map(exchange => {
                    return exchange.name;
                  })
                  .join(', ')}
            </LineItem>
          </Grid>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Policy',
                field: 'identifier',
              },
              {
                title: 'Category',
                field: 'category',
              },
              {
                title: 'Parameters',
                type: 'numeric',
                render: (rowData: any) => {
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
            title="Fund ruleset"
            isLoading={result.loading}
            options={{
              paging: false,
              search: false,
            }}
          />
        </NoSsr>
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
                render: (rowData: any) => {
                  return <TooltipNumber number={rowData.amount} decimals={rowData.asset.decimals} />;
                },
              },
              {
                title: 'Value [ETH]',
                type: 'numeric',
                render: (rowData: any) => {
                  return <TooltipNumber number={rowData.assetGav} />;
                },
                defaultSort: 'desc',
                customSort: (a, b) => sortBigNumber(a, b, 'assetGav'),
              },
            ]}
            data={currentHoldings}
            title="Portfolio holdings"
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
      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fund component contracts</Typography>
          <br />
          <Grid container={true}>
            {contractAddresses &&
              contractAddresses.map(a => {
                return (
                  <>
                    {a.name === 'Registry' && (
                      <LineItem name="" key="emptyLine">
                        &nbsp;
                      </LineItem>
                    )}
                    <LineItem name={a.name} key={a.name}>
                      <EtherscanLink address={a.address} />
                    </LineItem>
                  </>
                );
              })}
          </Grid>
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={12} md={6}>
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

      {/* <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Daily share price change (%)</Typography>

          <TSLineChart
            data={normalizedNumbers}
            dataKeys={['dailyReturn']}
            referenceLine={true}
            loading={result.loading}
          />
        </Paper>
      </Grid> */}

      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">NAV</Typography>
          <TSLineChart data={normalizedNumbers} dataKeys={['nav', 'gav']} yMax={maxNav} loading={result.loading} />
        </Paper>
      </Grid>

      {/* <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5"># Shares</Typography>
          <TSLineChart data={normalizedNumbers} dataKeys={['totalSupply']} yMax={maxSupply} loading={result.loading} />
        </Paper>
      </Grid> */}

      <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fund holdings</Typography>
          <FundHoldingsChart
            fundAddres={router && router.query.address}
            assets={assets.map(item => item.symbol)}
            yMax={fund && maxGav}
          />
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={12} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Time',
                render: rowData => {
                  return formatDate(rowData.timestamp, true);
                },
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Shares',
                type: 'numeric',
                render: rowData => {
                  return <TooltipNumber number={rowData.shares} />;
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

      {/* <Grid item={true} xs={12} sm={12} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fees in denomination asset</Typography>
          <TSLineChart data={normalizedNumbers} dataKeys={['feesInDenominationAsset']} loading={result.loading} />
        </Paper>
      </Grid> */}

      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Investor',
                field: 'owner.id',
              },
              {
                title: 'Shares',
                render: (rowData: any) => {
                  return <TooltipNumber number={rowData.shares} />;
                },
                type: 'numeric',
              },
            ]}
            data={investments}
            title="Current investors"
            options={{
              paging: false,
              search: false,
            }}
            isLoading={result.loading}
            onRowClick={(_, rowData: any) => {
              const url = '/investor?address=' + rowData.owner.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>

      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Time',
                field: 'timestamp',
                render: rowData => {
                  return formatDate(rowData.timestamp, true);
                },
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Investor',
                render: rowData => <ShortAddress address={rowData.owner.id} />,
              },
              {
                title: 'Action',
                field: 'action',
              },
              {
                title: 'Shares',
                render: (rowData: any) => <TooltipNumber number={rowData.shares} />,
                type: 'numeric',
              },
              {
                title: 'Share Price',
                render: (rowData: any) => <TooltipNumber number={rowData.sharePrice} />,
                type: 'numeric',
              },
              {
                title: 'Amount',
                type: 'numeric',
                render: rowData => {
                  if (rowData.action === 'Redemption') {
                    return '';
                  }
                  return <TooltipNumber number={rowData.amount} decimals={rowData.asset.decimals} />;
                },
              },
              {
                title: 'Asset',
                render: (rowData: any) => {
                  if (rowData.action === 'Redemption') {
                    return '(in kind)';
                  }
                  return rowData.asset.symbol;
                },
              },
              {
                title: 'Amount in ETH',
                render: (rowData: any) => {
                  return <TooltipNumber number={rowData.amountInDenominationAsset} />;
                },
                type: 'numeric',
              },
            ]}
            data={investmentHistory}
            title="Investments and redemptions"
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

      {investmentRequests.length > 0 && (
        <Grid item={true} xs={12} sm={12} md={12}>
          <NoSsr>
            <MaterialTable
              columns={[
                {
                  title: 'Date',
                  render: rowData => {
                    return formatDate(rowData.requestTimestamp, true);
                  },
                  cellStyle: {
                    whiteSpace: 'nowrap',
                  },
                  headerStyle: {
                    whiteSpace: 'nowrap',
                  },
                },
                {
                  title: 'Investor',
                  render: rowData => <ShortAddress address={rowData.owner.id} />,
                },
                {
                  title: 'Shares',
                  render: rowData => <TooltipNumber number={rowData.shares} />,
                  type: 'numeric',
                },
                {
                  title: 'Amount',
                  render: rowData => <TooltipNumber number={rowData.amount} decimals={rowData.asset.decimals} />,
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
                  cellStyle: {
                    whiteSpace: 'nowrap',
                  },
                  headerStyle: {
                    whiteSpace: 'nowrap',
                  },
                },
              ]}
              data={investmentRequests}
              title="Pending investment requests"
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

      {(router && router.query.debug === '1') || (
        <Grid item={true} xs={12} sm={12} md={12}>
          <Link href={debugLink} className={props.classes.debug}>
            Fund Events
          </Link>
        </Grid>
      )}
      {router && router.query.debug === '1' && fund && (
        <EventList
          contracts={[
            router.query.address,
            fund.accounting.id,
            fund.participation.id,
            fund.policyManager.id,
            fund.trading.id,
            fund.share.id,
          ]}
        />
      )}
    </Layout>
  );
};

export default withStyles(styles)(Fund);
