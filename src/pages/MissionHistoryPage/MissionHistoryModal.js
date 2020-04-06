import React, {Component} from "react";
import {Button, Card, Container, Grid, Icon, Image, Modal, Segment, Tab} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
import MyGreatPlace from "./Marker";
import {MAPS_CONFIG} from "../../config";
import {withFirebase} from "../../components/Firebase";

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

    deleteMission = () => {
        this.props.firebase.missionHistory(this.props.mission.uid).delete().then(this.props.refresh());
    };

    panes = [
        {
            menuItem: "Details",
            render: () => {
                const {mission} = this.state;
                return (
                    <Grid columns={2}>
                        <Grid.Column width={16}>
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
                        </Grid.Column>
                    </Grid>
                )
                    ;
            }
        },
        {
            menuItem: "Images on Map",
            render: () => {
                const {mission} = this.state;
                const pictures = mission["uploaded-images"];
                return (<Card fluid>
                    <Container style={mapBorder}>
                        <GoogleMapReact
                            bootstrapURLKeys={MAPS_CONFIG}
                            center={this.missionCenter(mission)}
                            zoom={this.missionZoom(mission)}
                        >
                            {pictures && pictures.map((p, index) => {
                                return (<MyGreatPlace
                                    lat={p.location.latitude} lng={p.location.longitude} id={"Picture" + index + 1}
                                    picture={p} text={index + 1}
                                />);
                            })}
                        </GoogleMapReact>
                    </Container>
                </Card>)
            }
        },
        {
            menuItem: "Image Gallery",
            render: () => {
                const {mission} = this.state;
                const pictures = mission["uploaded-images"];

                return (<Card.Group itemsPerRow={5}>
                    {pictures.map((picture, i) => (
                        <Modal closeIcon trigger={<Card style={{color: "#000000"}}>
                            <Image wrapped src={picture.thumbnail}></Image>
                            <Segment.Group style={{marginTop: "0", marginBottom: "0"}} compact horizontal>
                                <Segment><h2 style={{textAlign: "center"}}>{i + 1}</h2></Segment>
                                <Segment>
                                    <h4>{new Date(picture.timestamp).toLocaleTimeString()}</h4>
                                    Timestamp
                                </Segment>
                            </Segment.Group>
                        </Card>}>
                            <Modal.Content>
                                <Image wrapped src={picture.source}></Image>
                                <Segment.Group style={{marginBottom: "0"}} horizontal compact>
                                    <Segment>
                                        <h3>{new Date(picture.timestamp).toLocaleTimeString()}</h3>
                                        Timestamp
                                    </Segment>
                                    <Segment>
                                        <h3>{picture.location.altitude}</h3>
                                        Altitude
                                    </Segment>
                                    <Segment>
                                        <h3>{picture.location.latitude}</h3>
                                        Latitude
                                    </Segment>
                                    <Segment>
                                        <h3>{picture.location.longitude}</h3>
                                        Longitude
                                    </Segment>
                                </Segment.Group>
                            </Modal.Content>
                        </Modal>

                    ))}
                </Card.Group>)
            }
        },
        {
            menuItem: () => <Button style={{margin: "0"}} fluid negative onClick={() => this.deleteMission()}>
                <Icon name="trash"/>Delete</Button>
        }

    ];

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

        return (
            <Grid columns={1}>
                <Grid.Column>
                    <Tab menu={{attached: false, widths: 4}} panes={this.panes}/>
                </Grid.Column>
            </Grid>);
    }
}


export default withFirebase(MissionHistoryModal);
