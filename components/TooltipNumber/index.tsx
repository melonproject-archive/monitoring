import React from 'react';

import { withStyles } from '@material-ui/styles';
import { Tooltip } from '@material-ui/core';
import { formatBigNumber } from '~/utils/formatBigNumber';

export interface TooltipNumberProps {
  number: any;
  decimals?: number;
}

const styles = {};

const TooltipNumber: React.FunctionComponent<TooltipNumberProps> = props => {
  return (
    <Tooltip title={formatBigNumber(props.number, props.decimals || 18, 18)} placement="right">
      <span>{formatBigNumber(props.number, props.decimals || 18, 4)}</span>
    </Tooltip>
  );
};

export default withStyles(styles)(TooltipNumber);
