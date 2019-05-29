import React from 'react';
import { Grid, withStyles, WithStyles, StyleRulesCallback, Typography, Paper } from '@material-ui/core';
import { AmguPaymentsQuery, EngineQuery, ContractsQuery, ContractsScrapingQuery } from '~/queries/EngineQuery';
import moment from 'moment';

import { Graph } from 'react-d3-graph';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Navigation from '~/components/Navigation';
import { useScrapingQuery } from '~/utils/useScrapingQuery';

const styles: StyleRulesCallback = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type EngineProps = WithStyles<typeof styles>;

const Engine: React.FunctionComponent<EngineProps> = props => {
  const proceed = (current: any, expected: number) => {
    if (current.amguPayments && current.amguPayments.length === expected) {
      return true;
    }

    return false;
  };
  const result = useScrapingQuery([EngineQuery, AmguPaymentsQuery], proceed, { ssr: false });

  const proceedContracts = (current: any, expected: number) => {
    if (current.contracts && current.contracts.length === expected) {
      return true;
    }

    return false;
  };
  const contractResult = useScrapingQuery([ContractsQuery, ContractsScrapingQuery], proceedContracts, { ssr: false });

  const amguPrices = (result.data && result.data.amguPrices) || [];
  const amguPayments = (result.data && result.data.amguPayments) || [];
  const contracts = (contractResult.data && contractResult.data.contracts) || [];

  const amguCumulative: any[] = [];
  amguPayments.reduce((carry, item) => {
    amguCumulative.push({ ...item, cumulativeAmount: carry });
    return carry + parseInt(item.amount, 10);
  }, 0);

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
    height: 400,
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
    <Grid container={true} spacing={2}>
      <Navigation />
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Amgu Price</Typography>

          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={amguPrices}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis />
              <Line type="stepAfter" dataKey="price" stroke="#8884d8" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={6}>
        <Paper className={props.classes.paper}>
          <Typography variant="h5">Cumulative amgu paid</Typography>

          <ResponsiveContainer height={200} width="100%">
            <LineChart width={400} height={400} data={amguCumulative}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timeStr => moment(timeStr * 1000).format('MM/DD/YYYY')}
              />
              <YAxis domain={[0, 5000000]} />
              <Line type="linear" dataKey="cumulativeAmount" dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
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
    </Grid>
  );
};

export default withStyles(styles)(Engine);
