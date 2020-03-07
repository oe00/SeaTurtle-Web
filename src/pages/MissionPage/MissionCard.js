import React from "react";


import {
    Card, Segment,
} from "semantic-ui-react";

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
                            <Segment>
                                <h3>Route</h3>
                            </Segment>
                            <Segment.Group horizontal>
                                <Segment>
                                    <h3>Way Points</h3>
                                    {mission.route.length}
                                </Segment>
                                <Segment>
                                    <h3>Flight Time</h3>
                                    {mission.flightTime} Minutes
                                </Segment>
                                <Segment>
                                    <h3>Round Trip</h3>
                                    {mission.distance} KM
                                </Segment>
                            </Segment.Group>
                        </Segment.Group>
                        <Segment.Group horizontal>
                            <Segment>
                                <h3>Created</h3>
                                {mission.createdBy}<br/>
                                {mission.createdAt}<br/>
                            </Segment>
                            <Segment>
                                <h3>Edited</h3>
                                {mission.editedBy ? mission.editedBy : "None"}<br/>
                                {mission.editedAt ? mission.createdAt : "None"}<br/>
                            </Segment>
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
                            <h3>Progress</h3>
                            {mission.progress}%
                        </Segment>
                        <Segment>
                            <h3>Status</h3>
                            {mission.state}
                        </Segment>
                    </Segment.Group>
                    <Segment.Group>
                        <Segment>
                            <h3>Route</h3>
                        </Segment>
                        <Segment.Group horizontal>
                            <Segment>
                                <h3>Way Points</h3>
                                {mission.details.route.length}
                            </Segment>
                            <Segment>
                                <h3>Flight Time</h3>
                                {mission.details.flightTime} Minutes
                            </Segment>
                            <Segment>
                                <h3>Round Trip</h3>
                                {mission.details.distance} KM
                            </Segment>
                        </Segment.Group>
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
    </Card>));
}

export default MissionCard;
