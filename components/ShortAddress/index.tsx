import React from 'react';

import { withStyles } from '@material-ui/styles';
import { Tooltip } from '@material-ui/core';

export interface SortAddressProps {
  address: string;
  length?: number;
}

const styles = {};

const ShortAddress: React.FunctionComponent<SortAddressProps> = props => {
  return (
    <Tooltip title={props.address} placement="right">
      <span>{props.address.substr(0, props.length || 8)}...</span>
    </Tooltip>
  );
};

export default withStyles(styles)(ShortAddress);
