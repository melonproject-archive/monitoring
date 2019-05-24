import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
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
    variables: {
      fund: router.query.address,
    },
  });

  const fund = result.data && result.data.fund;
  const assets = (result.data && result.data.assets) || [];

  const token = createToken('WETH', undefined, 18);

  const normalizedGavs =
    fund &&
    fund.calculationsUpdates.map((item, index, array) => {
      return {
        ...item,
        gav: item.gav ? toFixed(createQuantity(token, item.gav)) : 0,
        totalSupply: item.totalSupply ? toFixed(createQuantity(token, item.totalSupply)) : 0,
        change: index > 0 ? (item.grossSharePrice / array[index - 1].grossSharePrice - 1) * 100 : 0,
        logReturn: index > 0 ? Math.log(item.grossSharePrice / array[index - 1].grossSharePrice) : 0,
      };
    });

  const returnSinceInception =
    normalizedGavs &&
    (normalizedGavs[normalizedGavs.length - 1].grossSharePrice / normalizedGavs[0].grossSharePrice - 1) * 100;
  const annualizedReturn =
    returnSinceInception &&
    normalizedGavs &&
    (returnSinceInception / (normalizedGavs[normalizedGavs.length - 1].timestamp - normalizedGavs[0].timestamp)) *
      (60 * 60 * 24 * 365.25);

  const volatility =
    normalizedGavs && standardDeviation(normalizedGavs.map(item => item.logReturn)) * 100 * Math.sqrt(365.25);

  const shares = fund && fund.totalSupply && toFixed(createQuantity(token, fund.totalSupply));
  const investmentLog =
    fund &&
    fund.investmentLog.map(item => {
      return {
        ...item,
        time: moment(item.timestamp).format('MM/DD/YYYY'),
        shares: toFixed(createQuantity(token, item.shares)),
      };
    });

  const holdingsLog = fund && fund.holdingsLog;
  const holdingsLength = holdingsLog && holdingsLog.length;

  const groupedHoldingsLog: any[] = [];
  let ts = 0;
  for (let k = 0; k < holdingsLength; k++) {
    if (ts !== holdingsLog[k].timestamp) {
      groupedHoldingsLog.push({
        timestamp: holdingsLog[k].timestamp,
        [holdingsLog[k].asset.symbol]: holdingsLog[k].holding,
      });
      ts = holdingsLog[k].timestamp;
    } else {
      groupedHoldingsLog[groupedHoldingsLog.length - 1][holdingsLog[k].asset.symbol] = holdingsLog[k].holding;
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
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fund information</Typography>

          {fund && (
            <>
              <div>Address: {fund.id}</div>
              <div>Name: {fund.name}</div>
              <div># shares: {shares}</div>
            </>
          )}
        </Paper>
      </Grid>
      <Grid item={true} xs={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">GAV / # Shares</Typography>

          <ResponsiveContainer height={200} width="80%">
            <LineChart width={400} height={400} data={normalizedGavs}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis />
              <Line type="monotone" dataKey="gav" dot={false} />
              <Line type="monotone" dataKey="totalSupply" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Share Price</Typography>

          <div>Return since inception: {returnSinceInception}%</div>
          <div>Annualized return: {annualizedReturn}%</div>
          <div>Volatility: {volatility}%</div>

          <ResponsiveContainer height={200} width="80%">
            <LineChart width={400} height={400} data={normalizedGavs}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis />
              <Line type="monotone" dataKey="grossSharePrice" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Daily change (%)</Typography>

          <ResponsiveContainer height={200} width="80%">
            <LineChart width={400} height={400} data={normalizedGavs}>
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
      <Grid item={true} xs={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Fund holdings</Typography>
          <ResponsiveContainer height={200} width="80%">
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
      <Grid item={true} xs={6}>
        <MaterialTable
          columns={[
            {
              title: 'Investor',
              field: 'owner.id',
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
      </Grid>
      <Grid item={true} xs={6}>
        <MaterialTable
          columns={[
            {
              title: 'Time',
              field: 'timestamp',
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
              field: 'shares',
              type: 'numeric',
            },
          ]}
          data={investmentLog}
          title="Investment Log"
          options={{
            paging: false,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Fund);
