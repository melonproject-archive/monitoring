import React from 'react';

import { withStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

export interface LineItemProps {
  name: string;
  linebreak?: boolean;
}

const styles = {};

const LineItem: React.FunctionComponent<LineItemProps> = props => {
  return (
    <>
      <Grid item={true} xs={4} sm={4} md={4}>
        <Typography variant="caption">{props.name}</Typography>
      </Grid>
      <Grid item={true} xs={8} sm={8} md={8}>
        {props.children}
        {props.linebreak && <div>&nbsp;</div>}
      </Grid>
    </>
  );
};

export default withStyles(styles)(LineItem);
