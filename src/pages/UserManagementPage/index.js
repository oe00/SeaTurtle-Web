import React from 'react';
import {compose} from 'recompose';

import {withAuthorization, withEmailVerification} from '../../components/Session';

import * as ROLES from "../../constants/roles";
import UserList from "./UserList";
import {Container} from "semantic-ui-react";

const UserManagement = () => (
    <Container>
        <h1>User Management</h1>
        <UserList/>
    </Container>
);

const condition = authUser => (authUser === null ? false : authUser.role === ROLES.ADMIN);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(UserManagement);
