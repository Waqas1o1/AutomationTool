import React from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import TitleIcon from "@material-ui/icons/Title";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import RemoveFromQueueIcon from "@material-ui/icons/RemoveFromQueue";
import LockOpenSharpIcon from "@material-ui/icons/LockOpenSharp";
import { authLogout } from "../store/actions/actions.js";
import {
  Breadcrumbs,
  Collapse,
  IconButton,
  Slide,
  useScrollTrigger,
} from "@material-ui/core";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import { Link } from "react-router-dom";
import DashboardIcon from "@material-ui/icons/Dashboard";
import HomeIcon from "@material-ui/icons/Home";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import CategoryIcon from "@material-ui/icons/Category";
import DnsIcon from "@material-ui/icons/Dns";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from "@material-ui/icons/Person";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import MenuIcon from "@material-ui/icons/Menu";
import MeetingRoomOutlinedIcon from "@material-ui/icons/MeetingRoomOutlined";
import { connect } from "react-redux";
const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  Bradlink: {
    display: "flex",
    color: "#010",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    width: "75%",
    left: drawerWidth + 50,
    top: "20px",
    "&.MuiPaper-root": {
      backgroundColor: "transparent",
      borderRadius: "12px",
      color: "black",
    },
    "@media only screen and (max-width: 600px)": {
      left: "35px",
      width: "81%",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    height: "90vh",
    top: "20px",
    marginLeft: "20px",
    boxShadow: "rgb(0 0 0 / 5%) 0rem 1.25rem 1.6875rem 0rem",
    borderRadius: "12px",
    "&.MuiPaper-root": {
      color: "white",
      background: "linear-gradient(195deg, rgb(35 35 44), rgb(25, 25, 25))",
    },
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(5),
    // padding: theme.spacing(4),
  },
  listItem: {
    "&.MuiListItem-button:hover": {
      backgroundColor: "#303f9f",
    },
  },
  divider: {
    flexShrink: "0",
    borderTop: "0px solid rgba(0, 0, 0, 0.08)",
    borderRight: "0px solid rgba(0, 0, 0, 0.08)",
    borderLeft: "0px solid rgba(0, 0, 0, 0.08)",
    height: "0.0625rem",
    margin: "1rem 0px",
    borderBottom: "none",
    opacity: 0.25,
    backgroundColor: "transparent",
    backgroundImage:
      "linear-gradient(to right, rgba(255, 255, 255, 0), rgb(255, 255, 255), rgba(255, 255, 255, 0)) !important",
  },
  Link: {
    color: "#FFF",
    textDecoration: "none",
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  // const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsKeywordManager, setCollapsKeywordManager] =
    React.useState(false);
  const [collapsUserManager, setCollapsUserManager] = React.useState(false);
  const [collapsAccountManager, setCollapsAccountManager] =
    React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider variant="middle" className={classes.divider} />
      <List>
        <Link to="/dashboard" className={classes.Link}>
          <ListItem button key={"videosLibarary"} className={classes.listItem}>
            <ListItemIcon>
              <DashboardIcon style={{ color: "#FFF" }} />
            </ListItemIcon>
            <ListItemText primary={"DashBorad"} />
          </ListItem>
        </Link>
        <Link to="/videolibrary" className={classes.Link}>
          <ListItem button key={"videosLibarary"} className={classes.listItem}>
            <ListItemIcon>
              <VideoLibraryIcon style={{ color: "#FFF" }} />
            </ListItemIcon>
            <ListItemText primary={"Video Library"} />
          </ListItem>
        </Link>
      </List>
      {/* Key management */}
      <ListItem
        button
        onClick={() => setCollapsKeywordManager(!collapsKeywordManager)}
      >
        <ListItemIcon style={{ color: "#FFF" }}>
          <KeyboardIcon />
        </ListItemIcon>
        <ListItemText primary="Keyword Manager" />
        {collapsKeywordManager ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={collapsKeywordManager} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/category" className={classes.Link}>
            <ListItem button key={"Category"} className={classes.listItem}>
              <ListItemIcon>
                <CategoryIcon style={{ color: "#FFF" }} />
              </ListItemIcon>
              <ListItemText primary={"Category"} />
            </ListItem>
          </Link>
          <Link to="/subcategory" className={classes.Link}>
            <ListItem button key={"Sub-Category"} className={classes.listItem}>
              <ListItemIcon>
                <DnsIcon style={{ color: "#FFF" }} />
              </ListItemIcon>
              <ListItemText primary={"Sub-Category"} />
            </ListItem>
          </Link>
          <Link to="/searchingtag" className={classes.Link}>
            <ListItem button key={"Searching-Tag"} className={classes.listItem}>
              <ListItemIcon>
                <LocalOfferIcon style={{ color: "#FFF" }} />
              </ListItemIcon>
              <ListItemText primary={"Searching-Tag"} />
            </ListItem>
          </Link>
        </List>
      </Collapse>
      {/* Users Manager */}
      <ListItem
        button
        onClick={() => setCollapsUserManager(!collapsUserManager)}
      >
        <ListItemIcon style={{ color: "#FFF" }}>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users Manager" />
        {collapsUserManager ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={collapsUserManager} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/users" className={classes.Link}>
            <ListItem button key={"User"} className={classes.listItem}>
              <ListItemIcon>
                <PersonIcon style={{ color: "#FFF" }} />
              </ListItemIcon>
              <ListItemText primary={"Users"} />
            </ListItem>
          </Link>
        </List>
        <List component="div" disablePadding>
          <Link to="/roles" className={classes.Link}>
            <ListItem button key={"Roles"} className={classes.listItem}>
              <ListItemIcon>
                <GroupWorkIcon style={{ color: "#FFF" }} />
              </ListItemIcon>
              <ListItemText primary={"Roles"} />
            </ListItem>
          </Link>
        </List>
      </Collapse>
      {/* Account Mangement */}
      <ListItem
        button
        onClick={() => setCollapsAccountManager(!collapsAccountManager)}
      >
        <ListItemIcon style={{ color: "#FFF" }}>
          <AccountTreeIcon />
        </ListItemIcon>
        <ListItemText primary="Account Manager" />
        {collapsAccountManager ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={collapsAccountManager} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/accountTypes" className={classes.Link}>
            <ListItem button key={"AccountType"} className={classes.listItem}>
              <ListItemIcon>
                <TitleIcon style={{ color: "#FFF" }} />
              </ListItemIcon>
              <ListItemText primary={"Types"} />
            </ListItem>
          </Link>
        </List>
        <List component="div" disablePadding>
          <Link to="/accountStatus" className={classes.Link}>
            <ListItem button key={"AccountStatus"} className={classes.listItem}>
              <ListItemIcon>
                <LiveHelpIcon style={{ color: "#FFF" }} />
              </ListItemIcon>
              <ListItemText primary={"Status"} />
            </ListItem>
          </Link>
        </List>
        <List component="div" disablePadding>
          <Link to="/accountPurpose" className={classes.Link}>
            <ListItem
              button
              key={"AccountPurpose"}
              className={classes.listItem}
            >
              <ListItemIcon>
                <RemoveFromQueueIcon style={{ color: "#FFF" }} />
              </ListItemIcon>
              <ListItemText primary={"Purposes"} />
            </ListItem>
          </Link>
        </List>
        <List component="div" disablePadding>
          <Link to="/accounts" className={classes.Link}>
            <ListItem button key={"Accounts"} className={classes.listItem}>
              <ListItemIcon>
                <LockOpenSharpIcon style={{ color: "#FFF" }} />
              </ListItemIcon>
              <ListItemText primary={"Accounts"} />
            </ListItem>
          </Link>
        </List>
      </Collapse>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar variant="dense">
            <div style={{flex:1}}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Breadcrumbs aria-label="breadcrumb">
                <Link to="/" color="inherit" className={classes.Bradlink}>
                  <HomeIcon className={classes.icon} />
                </Link>
                <Link color="inherit" to="/" className={classes.Bradlink}>
                  Home
                </Link>
              </Breadcrumbs>
            </div>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              edge="start"
              onClick={props.onLogout}
            >
              <MeetingRoomOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={"left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            variant="permanent"
            onClose={handleDrawerToggle}
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(authLogout()),
  };
};
export default connect(null, mapDispatchToProps)(ResponsiveDrawer);
