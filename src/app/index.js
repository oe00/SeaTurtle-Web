import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import Navigation from "../components/Navigation";
import SignUpPage from "../components/SignUp";
import SignInPage from "../components/SignIn";
import PasswordForgetPage from "../components/PasswordForget";
import Home from "../pages/DashboardPage";
import AccountPage from "../pages/AccountPage";
import AdminPage from "../pages/UserManagementPage";
import Demo from "../pages/FirstDemoPage";
import MissionSelection from "../pages/MissionPage";
import MissionManagement from "../pages/MissionManagementPage";

import * as ROUTES from "../constants/routes";
import {withAuthentication} from "../components/Session";

import {Container} from "semantic-ui-react";
import MissionResults from "../pages/MissionResultsPage";

//<Route render={() => <Redirect to={{pathname: ROUTES.HOME}} />} />

const App = () => (
    <Router>
        <div>
            <Navigation/>
            <Container>
                <Route exact path={ROUTES.HOME} component={Home}/>
                <Route exact path={ROUTES.FIRST_DEMO} component={Demo}/>
                <Route path={ROUTES.MISSION} component={MissionSelection}/>
                <Route path={ROUTES.MISSION_RESULTS} component={MissionResults}/>
                <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
                <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
                <Route
                    path={ROUTES.PASSWORD_FORGET}
                    component={PasswordForgetPage}
                />
                <Route path={ROUTES.ACCOUNT} component={AccountPage}/>
                <Route path={ROUTES.USER_MANAGEMENT} component={AdminPage}/>
                <Route path={ROUTES.MISSION_MANAGEMENT} component={MissionManagement}/>
            </Container>
        </div>
    </Router>
);

export default withAuthentication(App);
