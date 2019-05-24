import React from 'react';
import Link from 'next/link';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Paper } from '@material-ui/core';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

const Navigation: React.FunctionComponent<WithStyles<typeof styles>> = props => (
  <Grid item={true} xs={12}>
    <Paper className={props.classes.paper}>
      <Link href={'/engine'}>
        <a>Engine</a>
      </Link>{' '}
      |
      <Link href={'/assets'}>
        <a>Assets</a>
      </Link>{' '}
      |
      <Link href={'/investors'}>
        <a>Investors</a>
      </Link>
    </Paper>
  </Grid>
);

export default withStyles(styles)(Navigation);
