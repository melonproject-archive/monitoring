import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { createQuantity, createToken, toFixed } from '@melonproject/token-math';

import moment from 'moment';
import InvestorDetailsQuery from '~/queries/InvestorDetailsQuery';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Navigation from '~/components/Navigation';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type InvestorProps = WithStyles<typeof styles>;

const Investor: React.FunctionComponent<InvestorProps> = props => {
  const router = useRouter();
  const result = useQuery(InvestorDetailsQuery, {
    ssr: false,
    variables: {
      investor: router.query.address,
    },
  });

  const investor = result.data && result.data.investor;
  const investments = result.data && result.data.investor && result.data.investor.investments;

  const token = createToken('MLNF', undefined, 18);

  const investmentLog =
    (investor &&
      investor.investmentLog.map(item => {
        return {
          ...item,
          time: moment(item.timestamp * 1000).format('YYYY-MM-DD HH:mm'),
          shares: toFixed(createQuantity(token, item.shares)),
        };
      })) ||
    [];

  return (
    <Grid container={true} spacing={2}>
      <Navigation />
      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Investor information</Typography>
          {investor && (
            <>
              <div>Address: {investor.id}</div>
            </>
          )}
        </Paper>
      </Grid>

      {investments &&
        investments.map(item => (
          <Grid item={true} xs={12} key={item.id}>
            <Paper className={props.classes.paper}>
              <Typography variant="h5">{item.fund.name}</Typography>
              <div key={item.id}>Shares currently owned: {toFixed(createQuantity(token, item.shares))}</div>
              <div key={item.id}>Current value: {toFixed(createQuantity(token, item.gav))}</div>
              <ResponsiveContainer height={200} width="80%">
                <LineChart width={400} height={400} data={item.valuations}>
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
                  />
                  <YAxis />
                  <Line type="monotone" dataKey="gav" dot={false} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        ))}

      <Grid item={true} xs={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Investment Log</Typography>
          {investmentLog.map(item => (
            <div key={item.id}>
              {item.time} - {item.action} - {item.shares} - {item.fund.name}
            </div>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Investor);
