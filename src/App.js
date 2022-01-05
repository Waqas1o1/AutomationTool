import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
import VideoLibrary from "./pages/VideoLibrary";
import Login from "./pages/Login";
import { authCheckState } from "./store/actions/actions.js";
import Body from "./pages/Layouts/main";
import Dashboard from "./pages/Dashboard";
import { createTheme, ThemeProvider } from "@material-ui/core";
import Category from "./pages/KeywordManagement/Category";
import SubCategory from "./pages/KeywordManagement/SubCategory";
import SearchingTag from "./pages/KeywordManagement/SearchingTag";
import Users from "./pages/UserManagement/Users";
import Roles from "./pages/UserManagement/Roles";
// Accounts Management
import AccountTypes from "./pages/AccountsManagement/AccountTypes";
import AccountStatus from "./pages/AccountsManagement/AcccountStatus";
import AccountPurpose from "./pages/AccountsManagement/AccountPurpose";
import Accounts from "./pages/AccountsManagement/Accounts";
import { useEffect } from "react";
import KeywordAssignments from "./pages/ToolsManagement/KeywordAssignments";

const theme = createTheme({
  palette: {
    primary: {
      main: "#64C1A4",
    },
    success: {
      main: "#64C1A4",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h3: {
      "@media only screen and (max-width: 600px)": {
        fontSize: "20px",
      },
    },
    h4: {
      "@media only screen and (max-width: 600px)": {
        fontSize: "18px",
      },
    },
    h5: {
      "@media only screen and (max-width: 600px)": {
        fontSize: "16px",
      },
    },
  },
});
function App(props) {
  useEffect(() => {
    props.onLoad();
  }, [props]);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          {props.authenticated ? (
            <Body>
              {/* main */}
              <Route exact path="/">
                <Dashboard />
              </Route>
              <Route exact path="/dashboard">
                <Dashboard />
              </Route>
              <Route exact path="/videolibrary">
                <VideoLibrary />
              </Route>
              {/* Keyword Manager */}
              <Route exact path="/category">
                <Category />
              </Route>
              <Route exact path="/subcategory">
                <SubCategory />
              </Route>
              <Route exact path="/searchingtag">
                <SearchingTag />
              </Route>
              {/* User manager */}
              <Route exact path="/users">
                <Users />
              </Route>
              <Route exact path="/roles">
                <Roles />
              </Route>
              {/* Accounts Management */}
              <Route exact path="/accountTypes">
                <AccountTypes />
              </Route>
              <Route exact path="/accountStatus">
                <AccountStatus />
              </Route>
              <Route exact path="/accountPurpose">
                <AccountPurpose />
              </Route>
              <Route exact path="/accounts">
                <Accounts />
              </Route>
              {/* Tools Management */}
              <Route exact path="/assginkeyords">
                <KeywordAssignments />
              </Route>
            </Body>
          ) : null}
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.token !== null,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => dispatch(authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
