import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import FundDetailsQuery from '~/queries/FundDetailsQuery';
import { useRouter } from 'next/router';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import moment from 'moment';

const styles: StyleRulesCallback = theme => ({});

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

  const normalizedGavs =
    fund &&
    fund.calculationsUpdates.map(item => {
      return {
        timestamp: item.timestamp,
        gav: Number(BigInt(item.gav) / BigInt(10 ** 18)),
      };
    });

  // console.log(normalizedGavs);

  return (
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        {fund && (
          <>
            <div>Address: {fund.id}</div>
            <div>Name: {fund.name}</div>
          </>
        )}
      </Grid>
      <Grid item={true} xs={12}>
        <ResponsiveContainer height={200} width="80%">
          <LineChart width={400} height={400} data={normalizedGavs}>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
            />
            <YAxis />
            <Line type="monotone" dataKey="gav" stroke="#8884d8" dot={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Fund);
