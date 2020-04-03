import React, {Component} from "react";

import {withFirebase} from "../../components/Firebase";

import {Button, Card, Grid, Icon,} from "semantic-ui-react";
import Loading from "../../components/Loading";
import DroneStatusCard from "../../components/DroneStatusCard";


class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            droneStatus: null,
        };
    }

    componentDidMount() {
        this.onListenForDroneStatus();
    }

    onListenForDroneStatus = () => {
        this.props.firebase
            .droneStatus()
            .on("value", snapshot => {
                const droneStatus = snapshot.val();

                if (droneStatus) {

                    this.setState({
                        droneStatus: droneStatus,
                    });
                } else {
                    this.setState({
                        droneStatus: null,
                    });
                }
            });
    };


    render() {

        const {droneStatus} = this.state;

        return (
            <Grid>
                <Grid.Row><Grid.Column width={4}>
                    {droneStatus ? <Card fluid>
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
                                    <Button fluid size="small" color="grey" disabled> {droneStatus.battery}%</Button>
                                </Card>
                                {/**<Card fluid>
                                    <Card.Content>
                                        <Card.Header textAlign="center"><Icon bordered size="small"
                                                                              name="hdd"/> Remaining
                                            Storage</Card.Header>
                                    </Card.Content>
                                    <Button fluid size="small" disabled color="blue"> {"15 GB"}</Button>
                                </Card>*/}
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header textAlign="center"><Icon bordered size="small"
                                                                              name="play"/> Mission State</Card.Header>
                                    </Card.Content>
                                    <Button fluid size="small" disabled color="red"> {droneStatus.state}</Button>
                                </Card>
                            </Card.Content>
                        </Card>
                        :
                        <Loading size={100}/>}
                </Grid.Column>
                <Grid.Column width={4}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>
                                <h2>Pi Status</h2>
                            </Card.Header>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center">
                                        <Icon bordered size="small" name="wifi"/>
                                        Connection Status</Card.Header>
                                </Card.Content>
                                <Button fluid size="small" disabled color="green"> Active</Button>
                            </Card>
                        </Card.Content>
                    </Card>
                </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <DroneStatusCard/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    };
}

export default withFirebase(Dashboard);
