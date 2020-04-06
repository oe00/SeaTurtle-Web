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
            last_online: 0,
        };
    }

    componentDidMount() {
        this.onListenForPiStatus();
        this.onListenForDroneStatus();
    }

    onListenForDroneStatus = () => {
        this.props.firebase
            .droneStatus()
            .on("value", snapshot => {
                const droneStatus = snapshot.val();

                droneStatus.status = new Date() - this.state.last_online < 5500;

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

    onListenForPiStatus = () => {
        this.props.firebase
            .piStatus()
            .on("value", snapshot => {
                const piStatus = snapshot.val();

                if (piStatus) {
                    this.setState({
                        last_online: piStatus.last_online,
                    });
                } else {
                    this.setState({
                        last_online: 0,
                    });
                }
            });
    };

    componentWillUnmount() {
        this.props.firebase
            .droneStatus().off();
        this.props.firebase
            .activeMission().off();
    }


    render() {

        const {droneStatus} = this.state;

        return (
            <Grid>
                <Grid.Column width={4}>
                    {droneStatus ? <>
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
                                        <Button fluid size="small" className="dashboardCards"
                                                color={droneStatus.status ? "green" : "red"}> {droneStatus.status ? "Online" : "Offline"}</Button>
                                    </Card>
                                    <Card fluid>
                                        <Card.Content>
                                            <Card.Header textAlign="center"><Icon bordered size="small"
                                                                                  name="battery full"/> Remaining
                                                Battery</Card.Header>
                                        </Card.Content>
                                        <Button fluid size="small" color="purple"
                                                className="dashboardCards"> {droneStatus.battery}%</Button>
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
                                        <Button fluid size="small" className="dashboardCards"
                                                color="blue"> {droneStatus.state}</Button>
                                    </Card>
                                </Card.Content>
                            </Card>
                            <DroneStatusCard drone={droneStatus}/>
                        </>
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
                                {droneStatus && <Button fluid size="small" className="dashboardCards"
                                                        color={droneStatus && droneStatus.status ? "green" : "red"}> {droneStatus && droneStatus.status ? "Online" : "Offline"}</Button>}
                            </Card>
                        </Card.Content>
                    </Card>
                </Grid.Column>
                <Grid.Column width={8}>
                    <iframe style={{
                        display: "block",
                        border: "none",
                        width: "100%",
                        height: "100%"
                    }}
                            src="https://scene-viewer-preview.appspot.com/scene-viewer?file=https%3A%2F%2Fstorage.googleapis.com%2Far-answers-in-search-models%2Fstatic%2FGreenSeaTurtle%2Fmodel.glb&amp;title=Turtle"/>
                </Grid.Column>
            </Grid>
        )
    };
}

export default withFirebase(Dashboard);
