import React from "react";
import {Link} from "react-router-dom";

import {AuthUserContext} from "../Session";
import SignOutButton from "../SignOut";

import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

import {Container, Menu} from "semantic-ui-react";


const Navigation = () => (
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ? (
                <NavigationAuth authUser={authUser}/>
            ) : (
                <NavigationNonAuth/>
            )
        }
    </AuthUserContext.Consumer>
);

const NavigationAuth = ({authUser}) => (
    <Menu pointing secondary>
        <Container>
            <Menu.Item name="Dashboard" as={Link} to={ROUTES.HOME}/>
            <Menu.Item name="Mission" as={Link} to={ROUTES.MISSION}/>
            <Menu.Item name="Mission Results" as={Link} to={ROUTES.MISSION_RESULTS}/>
            {(authUser.role === ROLES.EXPERT || authUser.role === ROLES.ADMIN) && (
                <Menu.Item name="Mission Management" as={Link} to={ROUTES.MISSION_MANAGEMENT}/>
            )}
            {authUser.role === ROLES.ADMIN && (
                <Menu.Item name="User Management" as={Link} to={ROUTES.USER_MANAGEMENT}/>)}
            <Menu.Item name="First Demo" as={Link} to={ROUTES.FIRST_DEMO}/>
            <Menu.Menu position="right">
                <Menu.Item name="Account" as={Link} to={ROUTES.ACCOUNT}/>
                <SignOutButton/>
            </Menu.Menu>
        </Container>
    </Menu>
);

const NavigationNonAuth = () => (
    <>
        <Menu pointing secondary>
            <Container>
                <Menu.Item name="SeaTurtle Web Login" as={Link} to={ROUTES.HOME}/>
            </Container>
        </Menu>
    </>
);

export default Navigation;
