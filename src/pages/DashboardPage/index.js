import React from "react";
import {compose} from "recompose";

import {withAuthorization, withEmailVerification} from "../../components/Session";
import Dashboard from "./Dashboard";

/**
 *
 */

const Home = () => (
    <div>
        <h1>Dashboard</h1>
        <Dashboard/>
    </div>
);

const condition = authUser => (authUser===null ? false : authUser);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(Home);
