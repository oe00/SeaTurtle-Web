import MissionR from './MissionResult';
import React from 'react';
import {compose} from 'recompose';

import {withAuthorization, withEmailVerification} from '../../components/Session';
import {Container} from "semantic-ui-react";

const MissionResults = () => (
        <MissionR/>
);

const condition = authUser => (authUser === null ? false : authUser);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(MissionResults);

