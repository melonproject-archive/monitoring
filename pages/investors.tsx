import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Link, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import InvestorsQuery from '~/queries/InvestorsQuery';
import moment from 'moment';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const styles: StyleRulesCallback = theme => ({});

type InvestorsProps = WithStyles<typeof styles>;

const Investors: React.FunctionComponent<InvestorsProps> = props => {
  const result = useQuery(InvestorsQuery, {
    ssr: false,
  });

  const investors = (result.data && result.data.investors) || [];
  const investorCounts = (result.data && result.data.investorCounts) || [];

  return (
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        <Typography variant="h4">Number of investors</Typography>
        <ResponsiveContainer height={200} width="90%">
          <LineChart width={400} height={400} data={investorCounts}>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
            />
            <YAxis domain={[0, 40]} />
            <Line type="stepAfter" dataKey="numberOfInvestors" dot={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item={true} xs={12}>
        {investors.map(item => (
          <div key={item.id}>
            <Link href={`/investor?address=${item.id}`}>
              <a>{item.id}</a>
            </Link>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Investors);
