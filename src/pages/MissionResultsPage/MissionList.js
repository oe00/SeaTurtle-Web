import React, {Component} from "react";


import {Button, Card, Modal, Table} from "semantic-ui-react";
import MissionResultModal from "./MissionResultModal";
import {withFirebase} from "../../components/Firebase";

class MissionList extends Component {
    constructor(props) {
        super(props);
        this.deleteMission = this.deleteMission.bind(this);
    }


    deleteMission = (mission) => {
        this.props.firebase.missionHistory(mission.uid).delete().then(this.props.refresh);
    };

    render() {
        const {missions} = this.props;

        return (
            <Card fluid>
                <Card.Content>
                    <Table celled compact>
                        <Table.Header fullWidth>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Start Time</Table.HeaderCell>
                                <Table.HeaderCell>End Time</Table.HeaderCell>
                                <Table.HeaderCell>Pictures Taken</Table.HeaderCell>
                                <Table.HeaderCell>Operation</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {missions && missions.map((mission, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell>{mission.details.name}</Table.Cell>
                                    <Table.Cell>{mission.results.startTime} </Table.Cell>
                                    <Table.Cell>{mission.results.endTime} </Table.Cell>
                                    <Table.Cell>{mission.results.picturesTaken}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Modal size="fullscreen" trigger={<Button color="blue" labelPosition="right" icon="info" content="View" />}
                                               closeIcon>
                                            <Modal.Header>
                                                Mission Result - {mission.details.name}
                                            </Modal.Header>
                                            <Modal.Content>
                                                <MissionResultModal mission={mission} {...this.props}/>
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
