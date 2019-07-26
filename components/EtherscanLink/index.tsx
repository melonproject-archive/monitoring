import React from 'react';

import { withStyles } from '@material-ui/styles';

export interface EtherscanLinkProps {
  address: string;
}

const styles = {
  link: {
    borderBottom: 'dashed 1px white',
    textDecoration: 'none',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '110%',
  },
  middleEllipsis: {
    margin: '10px',
    display: 'flex',
    'flex-direction': 'row',
    'flex-wrap': 'nowrap',
    justifyContent: 'flex-start',
  },
  start: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    'white-space': 'nowrap',
    flexShrink: 1,
  },
  end: {
    'white-space': 'nowrap',
    flexBasis: 'content',
    flexGrow: 0,
    flexShrink: 0,
  },
};

const EtherscanLink: React.FunctionComponent<EtherscanLinkProps> = props => {
  return (
    <a
      href={'https://etherscan.io/address/' + props.address}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.link}
    >
      {props.address}
    </a>
  );
};

export default withStyles(styles)(EtherscanLink);
