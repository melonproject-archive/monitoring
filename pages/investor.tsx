import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { createQuantity, createToken, toFixed } from '@melonproject/token-math';

import InvestorDetailsQuery from '~/queries/InvestorDetailsQuery';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { formatDate } from '~/utils/formatDate';
import Layout from '~/components/Layout';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type InvestorProps = WithStyles<typeof styles>;

const token = createToken('MLNF', undefined, 18);

const Investor: React.FunctionComponent<InvestorProps> = props => {
  const router = useRouter();
  const result = useQuery(InvestorDetailsQuery, {
    ssr: false,
    variables: {
      investor: router.query.address,
    },
  });

  const investor = result.data && result.data.investor;
  const investments =
    result.data &&
    result.data.investor &&
    result.data.investor.investments.map(inv => {
      return {
        ...inv,
        valuationHistory: inv.valuationHistory.map(vals => {
          return {
            ...vals,
            nav: vals.gav ? toFixed(createQuantity(token, parseInt(vals.gav.toString(), 10))) : 0,
          };
        }),
      };
    });

  const valuationHistory = result.data && result.data.investor && result.data.investor.valuationHistory;

  const investmentHistory =
    (investor &&
      investor.investmentHistory.map(item => {
        return {
          ...item,
          time: formatDate(item.timestamp),
          shares: toFixed(createQuantity(token, item.shares)),
        };
      })) ||
    [];

  return (
    <Layout title="Investor">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Investor information</Typography>
          {investor && (
            <>
              <div>Address: {investor.id}</div>
            </>
          )}
        </Paper>
      </Grid>

      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">All assets</Typography>
          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={valuationHistory}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => formatDate(timeStr)}
              />
              <YAxis />
              <Line type="monotone" dataKey="gav" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {investments &&
        investments.map(item => (
          <Grid item={true} xs={12} sm={6} md={6} key={item.id}>
            <Paper className={props.classes.paper}>
              <Typography variant="h6">{item.fund.name}</Typography>
              <div>
                Fund address: <a href={'/fund?address=' + item.fund.id}>{item.fund.id}</a>
              </div>
              <div>Shares currently owned: {toFixed(createQuantity(token, item.shares))}</div>
              <div>Current value: {toFixed(createQuantity(token, item.gav))}</div>
              <ResponsiveContainer height={200} width="100%">
                <LineChart width={400} height={400} data={item.valuationHistory}>
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={timeStr => formatDate(timeStr)}
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
          {investmentHistory.map(item => (
            <div key={item.id}>
              {item.time} - {item.action} - {item.shares} -{' '}
              {item.sharePrice ? toFixed(createQuantity(token, item.sharePrice)) : ''} - {item.fund.name}
            </div>
          ))}
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Investor);
