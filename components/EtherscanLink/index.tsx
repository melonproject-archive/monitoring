import React from 'react';

import { withStyles } from '@material-ui/styles';

export interface EtherscanLinkProps {
  address?: string;
  tx?: string;
  short?: boolean;
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
  const path = props.address ? 'address' : props.tx ? 'tx' : '';
  const query = props.address || props.tx || '';
  const queryShort = props.short ? query.substr(0, 6) + '...' : query;

  return (
    <a href={`https://etherscan.io/${path}/${query}`} target="_blank" rel="noopener noreferrer" style={styles.link}>
      {queryShort}
    </a>
  );
};

export default withStyles(styles)(EtherscanLink);
