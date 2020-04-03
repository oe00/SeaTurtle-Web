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

        this.state = {
            mission: this.props.mission,
        };

    }

    missionCenter = (mission) => {
        if (!mission) {
            return defaultCenter;
        }

        let locations = mission["uploaded-images"];

        let long = 0;
        let lat = 0;

        locations.forEach(r => {
            long += r.location.longitude;
            lat += r.location.latitude;
        });
        return {lat: lat / locations.length, lng: long / locations.length};
    };

    missionZoom = (mission) => {

        let distance = mission.details.distance;

        if (!mission) {
            return defaultZoom;
        }

        let zoom = defaultZoom;

        if (distance > 0) {
            zoom = 19;
        }

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
        const {mission} = this.state;

        const pictures = mission["uploaded-images"];

        return (<Grid columns={2}>
            <Grid.Column width={4}>
                <Card fluid>
                    <Card.Content>
                        <Segment.Group horizontal>
                            <Segment>
                                <h3>{mission.details.distance} KM</h3>
                                Round Trip
                            </Segment>
                        </Segment.Group>
                        <Segment.Group horizontal>
                            <Segment>
                                <h3>{mission.mission_state}</h3>
                                Status
                            </Segment>
                            <Segment>
                                <h3>{mission.details.route.length}</h3>
                                Taken Pictures
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
                            {pictures && pictures.map((p, index) => {
                                return (<MyGreatPlace
                                    lat={p.location.latitude} lng={p.location.longitude} id={p.location.id}
                                    imageThumb={p.thumbnail} imageSource={p.source} text={index + 1} size={"large"}
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
