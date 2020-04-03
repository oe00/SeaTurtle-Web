import React, {Component} from "react";
import {Card, Segment} from "semantic-ui-react";
import {withFirebase} from "./Firebase";
import Loading from "./Loading";

class DroneStatusCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
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

        return (droneStatus ? <Card fluid>
            <Card.Content>
                <Card.Header>Drone Details</Card.Header>
            </Card.Content>
            <Card.Content>
                <Card.Description>
                    <Segment.Group>
                        <Segment.Group horizontal>
                            <Segment>
                                <h3>{droneStatus.airspeed.toFixed(2)}</h3>
                                Air Speed
                            </Segment>
                            <Segment>
                                <h3> {droneStatus.battery}%</h3>
                                Battery
                            </Segment>
                            <Segment>
                                <h3> {droneStatus.state}</h3>
                                State
                            </Segment>
                        </Segment.Group>
                        <Segment.Group horizontal>
                            <Segment>
                                <h3>{droneStatus.mode}</h3>
                                Mode
                            </Segment>
                            <Segment>
                                <h3> {droneStatus.armed ? "True" : "False"}</h3>
                                Armed
                            </Segment>
                        </Segment.Group>
                    </Segment.Group>
                </Card.Description>
            </Card.Content>
        </Card>: <Loading size={100}/>);
    }
}

export default withFirebase(DroneStatusCard);
