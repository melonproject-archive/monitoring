import React, { ReactNode } from 'react';
import { Grid } from '@material-ui/core';
import Navigation from '../Navigation';

export interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FunctionComponent<LayoutProps> = props => (
  <Grid container={true} spacing={2}>
    <Navigation />
    {props.children}
  </Grid>
);

export default Layout;
