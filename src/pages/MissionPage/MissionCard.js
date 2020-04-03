import React from "react";


import {Card, Segment,} from "semantic-ui-react";

function MissionCard(props) {
    const {mission, activeMission, resultMission} = props;

    return (mission && (!activeMission && !resultMission) ? (
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
    ) : !resultMission ? (<Card fluid>
        <Card.Content>
            <Card.Header>
                Mission Details
            </Card.Header>
        </Card.Content>
        <Card.Content>
            <Card.Content>
                <Card.Description>
                    <Segment.Group horizontal>
                        <Segment>
                            <h3>{mission.progress}%</h3>
                            Progress
                        </Segment>
                        <Segment>
                            <h3>{mission.state}</h3>
                            Status
                        </Segment>
                    </Segment.Group>
                    <Segment.Group>
                        <Segment.Group horizontal>
                            <Segment>
                                <h3>{mission.details.route.length}</h3>
                                Way Points
                            </Segment>
                            <Segment>
                                <h3>{mission.details.flightTime} Minutes</h3>
                                Flight Time
                            </Segment>
                            <Segment>
                                <h3>{mission.details.distance} KM</h3>
                                Round Trip
                            </Segment>
                        </Segment.Group>
                    </Segment.Group>
                    <Segment.Group horizontal>
                        <Segment>
                            <h3>{mission.picturesTaken}</h3>
                            Pictures Taken
                        </Segment>
                        <Segment>
                            <h3>{mission.details.flightTime} Minutes</h3>
                            ETA
                        </Segment>
                    </Segment.Group>
                </Card.Description>
            </Card.Content>
        </Card.Content>
    </Card>) : (<Card fluid>
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
                            <h3>Progress</h3>
                            {mission.progress}%
                        </Segment>
                        <Segment>
                            <h3>Status</h3>
                            {mission.state}
                        </Segment>
                    </Segment.Group>
                    <Segment.Group horizontal>
                        <Segment>
                            <h3>Pictures Taken</h3>
                            {mission.picturesTaken}
                        </Segment>
                        <Segment>
                            <h3>ETA</h3>
                            {"5 Minutes"}
                        </Segment>
                    </Segment.Group>
                </Card.Description>
            </Card.Content>
        </Card.Content>
    </Card>
    ));
}

export default MissionCard;
