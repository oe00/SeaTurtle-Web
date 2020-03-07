import React from "react";

import {withFirebase} from "../../components/Firebase";

import {
    Button,
    Card, Grid, Icon,
} from "semantic-ui-react";


function Dashboard() {
    return (
        <Grid>
            <Grid.Column width={4}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>
                            <h2>Drone Status</h2>
                        </Card.Header>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header textAlign="center">
                                    <Icon bordered size="small" name="wifi"/>
                                    Connection Status</Card.Header>
                            </Card.Content>
                            <Button fluid size="small" disabled color="green"> Active</Button>
                        </Card>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header textAlign="center"><Icon bordered size="small"
                                                                      name="battery full"/> Remaining
                                    Battery</Card.Header>
                            </Card.Content>
                            <Button fluid size="small" color="grey" disabled> {"90%"}</Button>
                        </Card>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header textAlign="center"><Icon bordered size="small"
                                                                      name="hdd"/> Remaining
                                    Storage</Card.Header>
                            </Card.Content>
                            <Button fluid size="small" disabled color="blue"> {"15 GB"}</Button>
                        </Card>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header textAlign="center"><Icon bordered size="small"
                                                                      name="play"/> Mission Status</Card.Header>
                            </Card.Content>
                            <Button fluid size="small" disabled color="red"> {"Not Running"}</Button>
                        </Card>
                    </Card.Content>
                </Card>
            </Grid.Column>
        </Grid>
    );
}

export default withFirebase(Dashboard);
