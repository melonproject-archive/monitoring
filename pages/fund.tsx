import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper, NoSsr } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import FundDetailsQuery from '~/queries/FundDetailsQuery';
import { useRouter } from 'next/router';
import { createQuantity, createToken, toFixed } from '@melonproject/token-math';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import moment from 'moment';
import MaterialTable from 'material-table';
import { standardDeviation } from '../utils/finance';
import Navigation from '~/components/Navigation';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type FundProps = WithStyles<typeof styles>;

const Fund: React.FunctionComponent<FundProps> = props => {
  const router = useRouter();
  const result = useQuery(FundDetailsQuery, {
    ssr: false,
    skip: !router,
    variables: {
      fund: router && router.query.address,
    },
  });

  const fund = result.data && result.data.fund;
  const assets = (result.data && result.data.assets) || [];

  const token = createToken('WETH', undefined, 18);

  const normalizedNumbers =
    fund &&
    fund.calculationsHistory.map((item, index, array) => {
      return {
        ...item,
        sharePrice: toFixed(createQuantity(token, item.sharePrice)),
        gav: item.gav ? toFixed(createQuantity(token, item.gav)) : 0,
        nav: item.nav ? toFixed(createQuantity(token, item.nav)) : 0,
        totalSupply: item.totalSupply ? toFixed(createQuantity(token, item.totalSupply)) : 0,
        change: index > 0 ? (item.sharePrice / array[index - 1].sharePrice - 1) * 100 : 0,
        logReturn: index > 0 ? Math.log(item.sharePrice / array[index - 1].sharePrice) : 0,
      };
    });

  const returnSinceInception =
    normalizedNumbers &&
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

  const shares = fund && fund.totalSupply && toFixed(createQuantity(token, fund.totalSupply));
  const investmentHistory =
    fund &&
    fund.investmentHistory.map(item => {
      return {
        ...item,
        time: moment(item.timestamp).format('MM/DD/YYYY hh:mm'),
        shares: toFixed(createQuantity(token, item.shares)),
        sharePrice: toFixed(createQuantity(token, item.sharePrice)),
      };
    });

  const holdingsHistory = fund && fund.holdingsHistory;
  const holdingsLength = holdingsHistory && holdingsHistory.length;

  const groupedHoldingsLog: any[] = [];
  let ts = 0;
  for (let k = 0; k < holdingsLength; k++) {
    if (ts !== holdingsHistory[k].timestamp) {
      groupedHoldingsLog.push({
        timestamp: holdingsHistory[k].timestamp,
        [holdingsHistory[k].asset.symbol]: holdingsHistory[k].holding,
      });
      ts = holdingsHistory[k].timestamp;
    } else {
      groupedHoldingsLog[groupedHoldingsLog.length - 1][holdingsHistory[k].asset.symbol] = holdingsHistory[k].holding;
    }
  }

  const investments =
    fund &&
    fund.investments.map(item => {
      return {
        ...item,
        shares: toFixed(createQuantity(token, item.shares)),
      };
    });

  return (
    <Grid container={true} spacing={2}>
      <Navigation />
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fund information</Typography>

          {fund && (
            <>
              <div>Address: {fund.id}</div>
              <div>Name: {fund.name}</div>
              <div>Manager: {fund.manager.id}</div>
              <div># shares: {shares}</div>
              <div>&nbsp;</div>
              <div>Return since inception: {returnSinceInception.toFixed(2)}%</div>
              <div>Annualized return: {annualizedReturn.toFixed(2)}%</div>
              <div>Volatility: {volatility.toFixed(2)}%</div>
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Share Price</Typography>
          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={normalizedNumbers}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis />
              <Line type="monotone" dataKey="sharePrice" dot={false} />
              <Tooltip
                labelFormatter={value => 'Date: ' + moment(parseInt(value as string, 10) * 1000).format('MM/DD/YYYY')}
                formatter={value => [value, 'Share price']}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">NAV & GAV</Typography>

          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={normalizedNumbers}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis />
              <Line type="monotone" dataKey="nav" dot={false} />
              <Line type="monotone" dataKey="gav" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5"># Shares</Typography>

          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={normalizedNumbers}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis />
              <Line type="monotone" dataKey="totalSupply" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Daily change (%)</Typography>

          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={normalizedNumbers}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis />
              <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="change" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fund holdings</Typography>
          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={groupedHoldingsLog}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis />
              {assets.map(item => (
                <Line type="monotone" dataKey={item.symbol} dot={false} key={item.id} />
              ))}
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Investor',
                render: rowData => {
                  return <a href={'/investor?address=' + rowData.owner.id}>{rowData.owner.id}</a>;
                },
              },
              {
                title: 'Shares',
                field: 'shares',
                type: 'numeric',
              },
            ]}
            data={investments}
            title="Investors"
            options={{
              paging: false,
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
                  return moment(rowData.timestamp * 1000).format('MM/DD/YYYY');
                },
              },
              {
                title: 'Investor',
                render: rowData => {
                  return <a href={'/investor?address=' + rowData.owner.id}>{rowData.owner.id}</a>;
                },
              },
              {
                title: 'Action',
                field: 'action',
              },
              {
                title: 'Shares',
                field: 'shares',
                type: 'numeric',
              },
              {
                title: 'Share Price',
                field: 'sharePrice',
                type: 'numeric',
              },
            ]}
            data={investmentHistory}
            title="Investment Log"
            options={{
              paging: false,
            }}
          />
        </NoSsr>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Fund);
