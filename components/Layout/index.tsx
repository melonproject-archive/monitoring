import React, { ReactNode } from 'react';
import {
  Grid,
  Paper,
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
  NoSsr,
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
  paper: {
    padding: theme.spacing(2),
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
    paddingLeft: theme.spacing(1),
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
    padding: theme.spacing(1),
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
            <NoSsr>
              <Grid container={true}>
                <Grid
                  container={true}
                  item={true}
                  xs={12}
                  spacing={2}
                  style={{ paddingLeft: '16px', paddingTop: '16px' }}
                >
                  <Grid item={true} xs={12} sm={12} md={12}>
                    <Paper className={classes.paper}>
                      <Typography variant="h5">Important notice</Typography>
                      <Typography variant="body2">
                        This is work in progress, and may contain incomplete and incorrect data. The current Melon
                        Monitoring Tool can still be found at:{' '}
                        <a href="http://monitoring.melon.network/" className={classes.aStyle}>
                          http://monitoring.melon.network/
                        </a>
                      </Typography>
                      <Typography variant="body2">
                        To set up a fund on the melon network, please download the latest <b>Melon manager interface</b>
                        from{' '}
                        <a
                          href="https://github.com/melonproject/melon-lab/releases/tag/v1.0.1"
                          className={classes.aStyle}
                        >
                          https://github.com/melonproject/melon-lab/releases/tag/v1.0.1
                        </a>{' '}
                      </Typography>
                    </Paper>
                  </Grid>

                  {this.props.children}
                </Grid>
              </Grid>
            </NoSsr>
          </main>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Layout);
