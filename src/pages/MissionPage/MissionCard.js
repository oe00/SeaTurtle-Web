import React from "react";


import {Card, Segment,} from "semantic-ui-react";

function MissionCard(props) {

    const {mission, selectedMission, activeMission, resultMission} = props;

    return (mission && selectedMission ? (
            <Card fluid>
                <Card.Content>
                    <Card.Header>
                        Mission Details
                    </Card.Header>
                </Card.Content>
                <Card.Content>
                    <Card.Content>
                        <Card.Description>
                            <Segment.Group>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3>{mission.route.length}</h3>
                                        Way Points
                                    </Segment>
                                    <Segment>
                                        <h3> {mission.flightTime} Minutes</h3>
                                        Flight Time
                                    </Segment>
                                    <Segment>
                                        <h3> {mission.distance} KM</h3>
                                        Round Trip
                                    </Segment>
                                </Segment.Group>
                            </Segment.Group>
                        </Card.Description>
                    </Card.Content>
                </Card.Content>
            </Card>
        ) : resultMission ? (<Card fluid>
                    <Card.Content>
                        <Card.Header>
                            Mission ´Progress
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Card.Content>
                            <Card.Description>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3>{mission.mission_state}</h3>
                                        State
                                    </Segment>
                                    <Segment>
                                        <h3>{mission["uploaded-images"].length}</h3>
                                        Pictures Taken
                                    </Segment>
                                </Segment.Group>
                            </Card.Description>
                        </Card.Content>
                    </Card.Content>
                </Card>
            ) :
            (activeMission && <Card fluid>
                    <Card.Content>
                        <Card.Header>
                            Mission Results
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Card.Content>
                            <Card.Description>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <h3>{mission.state}</h3>
                                        State
                                    </Segment>
                                    <Segment>
                                        <h3>{mission.picturesTaken}</h3>
                                        Pictures Taken
                                    </Segment>
                                </Segment.Group>
                            </Card.Description>
                        </Card.Content>
                    </Card.Content>
                </Card>
            )
    );
}

export default MissionCard;
