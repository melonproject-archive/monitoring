import React, { ReactNode } from 'react';
import {
  Grid,
  withStyles,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Hidden,
  Drawer,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';

// import Navigation from '../Navigation';
// import { Head  } from 'next/document';

export interface LayoutProps {
  title: string;
  children: ReactNode;
  classes: any;
}

const menuItems = [
  { title: 'Funds', link: '/' },
  { title: 'Engine', link: 'engine' },
  { title: 'Investors', link: 'investors' },
  { title: 'Asset Universe', link: 'assets' },
  { title: 'Contracts', link: 'contracts' },
  // { title: 'Addresses', link: 'addresses' },
  // { title: 'Glossary', link: 'glossary' },
];

const drawerWidth = 200;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  topDrawer: {
    ...theme.mixins.toolbar,
    background: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
    textAlign: 'center',
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    width: `calc(100% - ${drawerWidth}px)`,
    padding: theme.spacing.unit,
    paddingTop: '0px',
  },
  aStyle: {
    textDecoration: 'none',
    color: 'white',
  },
});

class Layout extends React.Component<LayoutProps> {
  public state = {
    mobileOpen: false,
  };

  public handleDrawerToggle = () => {
    // @ts-ignore
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  public render() {
    const { classes } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <Link href="/">
            <a className={classes.aStyle}>
              <div className={classes.topDrawer}>
                <img
                  src="https://github.com/melonproject/branding/raw/master/melon/11_Melon_icon.png"
                  alt="MLN logo"
                  width="50"
                  height="50"
                />{' '}
                <Typography variant="h6">&nbsp;MLN Network</Typography>
              </div>
            </a>
          </Link>
        </div>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <Link key={item.title} href={item.link}>
              <ListItem button={true} component="a" selected={this.props.title === item.title}>
                <ListItemText primary={item.title} />
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    );

    // return (
    //   <Grid container={true} spacing={2}>
    //     <Navigation />
    //     {this.props.children}
    //   </Grid>
    // );

    return (
      <>
        {/* <Head>
          <title>MLN network - {this.props.title}</title>
        </Head> */}

        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap={true}>
                {this.props.title}
              </Typography>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer}>
            <Hidden smUp={true} implementation="css">
              <Drawer
                variant="temporary"
                anchor={'left'}
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown={true} implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open={true}
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container={true}>
              <p />
              <Grid container={true} item={true} xs={12} spacing={2}>
                {this.props.children}
              </Grid>
            </Grid>
          </main>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Layout);
