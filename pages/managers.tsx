import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, NoSsr } from '@material-ui/core';
import Layout from '~/components/Layout';
import ManagerList from '~/components/ManagerList';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

type ManagersProps = WithStyles<typeof styles>;

const Managers: React.FunctionComponent<ManagersProps> = props => {
  return (
    <Layout title="Managers">
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <ManagerList />
        </NoSsr>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Managers);
