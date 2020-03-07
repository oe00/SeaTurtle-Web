import React, {Component} from "react";

import {withFirebase} from "../../components/Firebase";


import {Table, Button, Card, Checkbox, Modal} from "semantic-ui-react";
import MissionEditModal from "./MissionEditModal";

class MissionList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            missions: [],
        };

        this.handleAllowedToggle = this.handleAllowedToggle.bind(this);
        this.deleteMission = this.deleteMission.bind(this);
    }

    handleAllowedToggle = (mission) => {
        this.props.firebase.mission(mission.uid).update({
            isAllowed: !mission.isAllowed
        }).then(this.props.refresh);
    };

    deleteMission = (mission) => {
        this.props.firebase.mission(mission.uid).delete().then(this.props.refresh);
    };


    render() {
        const {missions} = this.props;

        return (
            <Card fluid>
                <Card.Content>
                    <Table celled compact definition>
                        <Table.Header fullWidth>
                            <Table.Row>
                                <Table.HeaderCell>Active</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Created By</Table.HeaderCell>
                                <Table.HeaderCell>Waypoints</Table.HeaderCell>
                                <Table.HeaderCell>Distance</Table.HeaderCell>
                                <Table.HeaderCell>Flight Time</Table.HeaderCell>
                                <Table.HeaderCell>Operation</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {missions && missions.map((mission, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell collapsing>
                                        <Checkbox checked={mission.isAllowed} toggle
                                                  onClick={() => this.handleAllowedToggle(mission)}/>
                                    </Table.Cell>
                                    <Table.Cell>{mission.name}</Table.Cell>
                                    <Table.Cell>{mission.createdBy}</Table.Cell>
                                    <Table.Cell>{mission.route.length}</Table.Cell>
                                    <Table.Cell>{mission.distance} KM</Table.Cell>
                                    <Table.Cell>{mission.flightTime} Minutes</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Modal size="fullscreen" trigger={<Button color="blue" icon="edit" labelPosition="right" content="Edit"/>}
                                               closeIcon>
                                            <Modal.Header>
                                                Edit Mission - {mission.name}
                                            </Modal.Header>
                                            <Modal.Content>
                                                <MissionEditModal mission={mission} {...this.props}/>
                                            </Modal.Content>
                                        </Modal>
                                        <Button color="red" icon="delete" labelPosition="right" content="Delete" onClick={() => this.deleteMission(mission)}/>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Card.Content>
            </Card>
        );
    }
}

export default withFirebase(MissionList);


//                                                <Table.Cell>{mission.route.map((point, index) => <Button size="tiny"
//                                                     key={index}>{point.latitude.toFixed(2)},{point.longitude.toFixed(2)}</Button>)}</Table.Cell>