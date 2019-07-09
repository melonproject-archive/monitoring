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
  //   const startOfAddress = props.address.slice(0, 28);
  //   const endOfAddress = props.address.slice(-4);
  return (
    // <div>
    <a
      href={'https://etherscan.io/address/' + props.address}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.link}
    >
      {/* <span style={styles.start}>{startOfAddress}</span>
        <span style={styles.end}>{endOfAddress}</span> */}
      {props.address}
    </a>
    // </div>
  );
};

export default withStyles(styles)(EtherscanLink);
