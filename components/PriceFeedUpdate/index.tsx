import React from 'react';

import { withStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import { LastPriceUpdateQuery } from '~/queries/EngineDetailsQuery';
import * as R from 'ramda';
import { formatDate } from '~/utils/formatDate';
import { Typography } from '@material-ui/core';

const styles = {};

const PriceFeedUpdate: React.FunctionComponent<{}> = props => {
  const result = useQuery(LastPriceUpdateQuery, { ssr: false });
  const priceUpdate = R.pathOr('', ['data', 'state', 'lastPriceUpdate'], result);

  return (
    <Typography variant="caption">
      Pricefeed last updated:
      <br />
      {priceUpdate && formatDate(priceUpdate, true)}
    </Typography>
  );
};

export default withStyles(styles)(PriceFeedUpdate);
