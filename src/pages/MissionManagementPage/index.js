import MissionM from './MissionManagement';
import React from 'react';
import {compose} from 'recompose';

import {withAuthorization, withEmailVerification} from '../../components/Session';
import {Container} from "semantic-ui-react";
import * as ROLES from "../../constants/roles";

const MissionManagement = () => (
    <Container>
        <h1>Mission Management</h1>
        <MissionM/>
    </Container>
);

const condition = authUser => (authUser === null ? false : authUser.role === ROLES.ADMIN || authUser.role === ROLES.EXPERT);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(MissionManagement);

