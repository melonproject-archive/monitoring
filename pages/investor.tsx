import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { createQuantity, createToken, toFixed } from '@melonproject/token-math';

import moment from 'moment';
import InvestorDetailsQuery from '~/queries/InvestorDetailsQuery';

const styles: StyleRulesCallback = theme => ({});

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
    <Grid container={true} spacing={6}>
      <Grid item={true} xs={12}>
        {investor && (
          <>
            <Typography variant="h5">Investor</Typography>
            <div>Address: {investor.id}</div>
          </>
        )}
      </Grid>
      <Grid item={true} xs={12}>
        <Typography variant="h5">Investment Log</Typography>
        {investmentLog.map(item => (
          <div key={item.id}>
            {item.time} - {item.action} - {item.shares} - {item.fund.name}
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Investor);
