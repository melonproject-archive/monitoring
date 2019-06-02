import React from 'react';
import * as R from 'ramda';

import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/core';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import { SingleAssetPriceHistoryQuery } from '~/queries/AssetsQuery';
import TimeSeriesChart from '../TimeSeriesChart';

export interface AssetChartProps {
  id: string;
  height: number;
}

const styles: StyleRulesCallback = theme => ({});

const AssetChart: React.FunctionComponent<AssetChartProps> = props => {
  const result = useScrapingQuery(
    [SingleAssetPriceHistoryQuery, SingleAssetPriceHistoryQuery],
    proceedPaths(['assetPriceHistories']),
    { ssr: false, variables: { id: props.id } },
  );

  const assetPrices = R.pathOr([], ['data', 'assetPriceHistories'], result);

  return <TimeSeriesChart data={assetPrices} dataKeys={['price']} height={props.height} />;
};

export default withStyles(styles)(AssetChart);
