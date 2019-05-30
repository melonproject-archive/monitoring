import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Paper } from '@material-ui/core';
import { ContractsQuery, ContractsScrapingQuery } from '~/queries/ContractsQuery';

import { Graph } from 'react-d3-graph';

import { useScrapingQuery } from '~/utils/useScrapingQuery';
import Layout from '~/components/Layout';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type ContractsProps = WithStyles<typeof styles>;

const Contracts: React.FunctionComponent<ContractsProps> = props => {
  const proceedContracts = (current: any, expected: number) => {
    if (current.contracts && current.contracts.length === expected) {
      return true;
    }

    return false;
  };
  const contractResult = useScrapingQuery([ContractsQuery, ContractsScrapingQuery], proceedContracts, { ssr: false });

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

  const graphConfig = {
    nodeHighlightBehavior: true,
    width: 1200,
    height: 800,
    node: {
      color: 'black',
      size: 120,
      highlightStrokeColor: 'blue',
      labelProperty: 'name',
    },
    link: {
      highlightColor: 'lightblue',
    },
  };

  // console.log(graphData);

  return (
    <Layout title="Contracts">
      <Grid item={true} xs={12} sm={12} md={12}>
        <Paper className={props.classes.paper}>
          {graphData.nodes && graphData.nodes.length > 0 && (
            <Graph
              id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
              data={graphData}
              config={graphConfig}
            />
          )}
        </Paper>
      </Grid>
    </Layout>
  );
};

export default withStyles(styles)(Contracts);
