import React, {Component} from "react";
import {Card, Container, Grid, Segment} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
import MyGreatPlace from "./Marker";
import {MAPS_CONFIG} from "../../config";

const defaultCenter = {lat: 35.197970240448015, lng: 33.532330183981806};
const defaultZoom = 11;

const mapBorder = {width: "100% ", height: "75vh "};

class MissionHistoryModal extends Component {
    constructor(props) {
        super(props);

        let missionRoute = null;

        if (this.props.mission) {
            missionRoute = this.props.mission.mockLocations.map((item) => {
                return {latitude: item.latitude, longitude: item.longitude}
            });
        }

        this.state = {
            mission: this.props.mission,
            pictureLocations: missionRoute,
        };

    }

    missionCenter = (mission) => {
        if (!mission) {
            return defaultCenter;
        }

        let locations = mission.mockLocations;

        let long = 0;
        let lat = 0;
        locations.forEach(r => {
            long += r.longitude;
            lat += r.latitude;
        });
        return {lat: lat / locations.length, lng: long / locations.length};
    };

    missionZoom = (mission) => {

        let distance = mission.details.distance;

        if (!mission) {
            return defaultZoom;
        }

        let zoom = defaultZoom;

        if (distance > 1) {
            zoom = 16;
        }
        if (distance > 2) {
            zoom = 15;
        }
        if (distance > 4) {
            zoom = 14;
        }
        if (distance > 8) {
            zoom = 13;
        }

        return zoom + 1;
    };

    render() {
        const {mission, pictureLocations} = this.state;

        console.log(mission)

        return (<Grid columns={2}>
            <Grid.Column width={4}>
                <Card fluid>
                    <Card.Content>
                        <Segment>
                            <h3>{mission.jobID}</h3>
                            Job ID
                        </Segment>
                        <Segment.Group horizontal>
                            <Segment>
                                <h3>{mission.details.distance} KM</h3>
                                Round Trip
                            </Segment>
                            <Segment>
                                <h3>{mission.results.progress}%</h3>
                                Progress
                            </Segment>
                        </Segment.Group>
                        <Segment.Group horizontal>
                            <Segment>
                                <h3>{mission.results.state}</h3>
                                Status
                            </Segment>
                            <Segment>
                                <h3>{mission.details.route.length}</h3>
                                Waypoints
                            </Segment>
                        </Segment.Group>
                    </Card.Content>
                </Card>
            </Grid.Column>
            <Grid.Column width={12}>
                <Card fluid>
                    <Container style={mapBorder}>
                        <GoogleMapReact
                            bootstrapURLKeys={MAPS_CONFIG}
                            center={this.missionCenter(mission)}
                            zoom={this.missionZoom(mission)}
                        >
                            {pictureLocations && pictureLocations.map((location, index) => {
                                return (<MyGreatPlace
                                    lat={location.latitude} lng={location.longitude} id={location.id}
                                    text={index + 1} size={"large"}
                                />);
                            })}
                        </GoogleMapReact>
                    </Container>
                </Card>
            </Grid.Column>
        </Grid>);
    }
}


export default MissionHistoryModal;
