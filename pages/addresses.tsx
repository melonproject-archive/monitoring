import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Paper } from '@material-ui/core';
import { ContractsQuery } from '~/queries/ContractList';
import Layout from '~/components/Layout';
import { useQuery } from '@apollo/react-hooks';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type AddressesProps = WithStyles<typeof styles>;

const Addresses: React.FunctionComponent<AddressesProps> = props => {
  const contractResult = useQuery(ContractsQuery, {
    ssr: false,
  });

  const contracts = (contractResult.data && contractResult.data.contracts) || [];
  const graphData = { nodes: [] as any, links: [] as any[] };
  contracts.map(item => {
    if (item.parent && item.parent.id) {
      graphData.links.push({ source: item.parent.id, target: item.id });
      graphData.nodes.push({ id: item.id, name: item.name });
    }
    if (item.name === 'Registry') {
      graphData.nodes.push({ id: item.id, name: item.name });
    }
    return;
  });

  return (
    <Layout title="Contracts" page="addresses">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>Addresses\</Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Addresses);
