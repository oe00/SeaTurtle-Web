import React, {Component} from "react";


import {Button, Card, Icon, Loader, Message, Modal, Table} from "semantic-ui-react";
import MissionHistoryModal from "./MissionHistoryModal";
import {withFirebase} from "../../components/Firebase";
import Loading from "../../components/Loading";

class MissionH extends Component {
    constructor(props) {
        super(props);
        this.deleteMission = this.deleteMission.bind(this);

        this.state = {
            missions: [],
            empty: false,
        }
    }


    deleteMission = (mission) => {
        this.props.firebase.missionHistory(mission.uid).delete().then(this.onListenForMissionHistoriesDatabase());
    };

    getMissionDetails = (mid) => {
        return this.props.firebase
            .mission(mid)
            .get().then(doc => {
                return doc.data();
            });
    };

    onListenForMissionHistoriesDatabase = () => {
        this.setState({empty: false, missions: []});
        this.props.firebase
            .missionHistories()
            .orderBy("started_at", "desc")
            .get().then(snapshot => {
            snapshot.forEach(async doc => {
                const missionObject = doc.data();

                if (missionObject) {

                    const images = Object.keys(missionObject["uploaded-images"]).map(key => ({
                        ...missionObject["uploaded-images"][key],
                    }));

                    missionObject["uploaded-images"] = images;

                    const mission = {
                        ...missionObject,
                        uid: doc.id,
                    };

                    mission.details = await this.getMissionDetails(mission.mission_ref);

                    this.setState({
                        missions: [...this.state.missions, mission],
                    });

                }
            });
            if (snapshot.empty)
                this.setState({empty: true});
        });

    };

    componentDidMount() {
        this.onListenForMissionHistoriesDatabase();
    }

    render() {
        const {missions, empty} = this.state;

        return (
            missions.length > 0 ?
                <Table celled compact>
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Started At</Table.HeaderCell>
                            <Table.HeaderCell>State</Table.HeaderCell>
                            <Table.HeaderCell>Taken Images</Table.HeaderCell>
                            <Table.HeaderCell>Operation</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {missions.map((mission, i) => (
                            <Table.Row key={i}>
                                <Table.Cell>{mission.details.name}</Table.Cell>
                                <Table.Cell>{new Date(mission.started_at).toLocaleTimeString()}</Table.Cell>
                                <Table.Cell>{mission.mission_state}</Table.Cell>
                                <Table.Cell>{mission["uploaded-images"].length}</Table.Cell>
                                <Table.Cell collapsing>
                                    <Modal size="fullscreen"
                                           trigger={<Button color="blue" labelPosition="right" icon="info"
                                                            content="View"/>}
                                           closeIcon>
                                        <Modal.Header>
                                            Mission Result - {mission.details.name}
                                        </Modal.Header>
                                        <Modal.Content>
                                            <MissionHistoryModal mission={mission}/>
                                        </Modal.Content>
                                    </Modal>
                                    <Button color="red" icon="delete" labelPosition="right" content="Delete"
                                            onClick={() => this.deleteMission(mission)}/>
                                </Table.Cell>
                            </Table.Row>
                        ))
                        }
                    </Table.Body>
                </Table>
                : empty ? <Message info icon>
                    <Icon name='warning sign'/>
                    <Message.Content>
                        <Message.Header>No Results.</Message.Header>
                        Please complete a mission first.
                    </Message.Content>
                </Message>
                : <Loading size={100}/>

        );
    }
}

export default withFirebase(MissionH);
