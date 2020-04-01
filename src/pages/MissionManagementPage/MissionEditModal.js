import React, {Component} from "react";
import {Card, Container, Form, Grid, Message, Segment} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
import MyGreatPlace from "./Marker";
import {getDistance} from "geolib";
import {MAPS_CONFIG} from "../../config";
import * as ReactDOM from "react-dom";

const defaultCenter = {lat: 35.197970240448015, lng: 33.532330183981806};
const defaultZoom = 9;

const mapBorder = {width: "100% ", height: "75vh "};

class MissionEditModal extends Component {
    constructor(props) {
        super(props);

        let missionRoute = [];
        let missionName = "";
        let missionDistance = 0;

        if (this.props.mission) {
            missionRoute = this.props.mission.route.map((item) => {
                return {latitude: item.latitude, longitude: item.longitude}
            });
            missionName = this.props.mission.name;
            missionDistance = this.props.mission.distance;
        }

        this.state = {
            mission: this.props.mission,
            locations: missionRoute,
            inputName: missionName,
            submitName: missionName,
            distance: missionDistance,
            errorName: false,
            errorDistance: false,
            draggable: true,
            hidePopup: false,
        };

    }


    handleMapClick = async (map) => {
        const location = {latitude: map.lat, longitude: map.lng};
        await this.setState(prevState => ({
            locations: [...prevState.locations, location],
        }), this.locationDistanceUpdate);
    };

    handleChildClick = async (lat,lng) =>{
        const newState = [...this.state.locations];
        const index = newState.findIndex(i => i.latitude === lat && i.longitude === lng);
        newState.splice(index, 1);
        await this.setState({
            locations: newState,
        }, this.locationDistanceUpdate);
    };

    locationDistanceUpdate = () => {
        const {locations} = this.state;

        let sum_distance = 0;
        let length = locations.length;
        for (let i = 0; i < length - 1; i++) {
            sum_distance += getDistance({latitude: locations[i].latitude, longitude: locations[i].longitude},
                {latitude: locations[i + 1].latitude, longitude: locations[i + 1].longitude}, 1);
        }
        this.setState({distance: ((sum_distance *= 2) / 1000.0).toFixed(2)});

        this.renderPolylines(locations);
    };

    missionCenter = (mission) => {
        if (!mission) {
            return defaultCenter;
        }

        let long = 0;
        let lat = 0;
        mission.route.forEach(r => {
            long += r.longitude;
            lat += r.latitude;
        });
        return {lat: lat / mission.route.length, lng: long / mission.route.length};
    };

    missionZoom = (mission) => {
        if (!mission) {
            return defaultZoom;
        }

        let zoom = 18;

        if (mission.distance > 1) {
            zoom = 15;
        }
        if (mission.distance > 2) {
            zoom = 14;
        }
        if (mission.distance > 5) {
            zoom = 13;
        }
        if (mission.distance > 10) {
            zoom = 11;
        }

        return zoom + 1.35;
    };

    submitMe = () => {
        this.setState({errorName: false, errorDistance: false});

        const {mission, inputName, locations, distance} = this.state;

        if (inputName.length < 1 || distance > 9.5) {
            if (inputName.length < 1) {
                this.setState({errorName: true});
            }
            if (distance > 9.5) {
                this.setState({errorDistance: true});
            }
            //setTimeout(() => this.setState({errorName: false, errorDistance: false}), 2000);
            return;
        }

        const missionRoute = locations.map((item) => {
            return {latitude: item.latitude, longitude: item.longitude}
        });

        this.setState({submitName: this.state.inputName, open: false});

        if (mission) {
            this.props.firebase.mission(mission.uid).update(
                {
                    name: inputName,
                    route: missionRoute,
                    distance: distance,
                    flightTime: ((distance * 1000) / 480).toFixed(0),
                    editedBy: this.props.firebase.auth.currentUser.email,
                    editedAt: new Date().toDateString(),
                }).then(this.props.refresh);
        } else {
            this.props.firebase.missions().add(
                {
                    name: inputName,
                    route: missionRoute,
                    distance: distance,
                    flightTime: ((distance * 1000) / 480).toFixed(0),
                    createdAt: new Date().toDateString(),
                    createdBy: this.props.firebase.auth.currentUser.email,
                    editedAt: null,
                    editedBy: null,
                    isAllowed: true,
                }
            ).then(this.props.refresh);
            this.props.modalClose();
        }
    };

    testMapAPI = null;
    testMap = null;
    oldPath = null;

    passMapReference(map, maps) {
        this.testMap = map;
        this.testMapAPI = maps;

        this.renderPolylines(this.state.locations);
    }

    renderPolylines(locations) {

        let maps = this.testMapAPI;

        let locs = locations.map(l => {
            return ({lat: l.latitude, lng: l.longitude})
        });

        if (this.oldPath != null) {
            this.oldPath.setMap(null);
        }

        this.oldPath = new maps.Polygon({
            path: locs,
            strokeColor: '#f44336',
            strokeOpacity: 1,
            strokeWeight: 4,
            fillOpacity: 0,
            map: this.testMap,
        });


    }

    onCircleInteraction = (childKey, childProps, mouse) => {
        this.setState({
            draggable: false,
            hidePopup:true,
        });

        const newState = [...this.state.locations];
        newState.splice(childProps.id, 1, {latitude: mouse.lat, longitude: mouse.lng});
        this.setState({
            locations: newState,
        }, this.locationDistanceUpdate);

    };

    handleChange = (e, {value}) => this.setState({inputName: value});

    render() {
        const {mission, locations, inputName, distance, errorName, errorDistance} = this.state;

        return (<Grid columns={2}>
            <Grid.Column width={6}>
                <Card fluid>
                    <Card.Content>
                        {(errorName || errorDistance) && (<Message error>
                            <Message.Header>Error</Message.Header>
                            {errorName && <Message.Content>Please enter mission name</Message.Content>}
                            {errorDistance && <Message.Content>Round trip must be less than 9.6 KM</Message.Content>}
                        </Message>)}
                        <Form onSubmit={this.submitMe}>
                            <Segment>
                                <h3>Mission Name</h3>
                                <Form.Input
                                    onChange={this.handleChange}
                                    value={inputName}
                                    error={errorName}
                                />
                            </Segment>
                            <Segment.Group horizontal>
                                <Segment>
                                    <h3>Round Trip</h3>
                                    {distance} KM
                                </Segment>
                                <Segment>
                                    <h3>Flight Time</h3>
                                    {((distance * 1000) / 480).toFixed(0)} Minutes
                                </Segment>
                                <Segment>
                                    <h3>Waypoints</h3>
                                    {locations.length}
                                </Segment>
                            </Segment.Group>
                            <Form.Button content='Submit'/>
                        </Form>
                    </Card.Content>
                </Card>
            </Grid.Column>
            <Grid.Column width={10}>
                <Card fluid>
                    <Container style={mapBorder}>
                        <GoogleMapReact
                            bootstrapURLKeys={MAPS_CONFIG}
                            center={this.missionCenter(mission)}
                            zoom={this.missionZoom(mission)}
                            onChildMouseDown={async () => await this.setState({draggable: !this.state.draggable,hidePopup:false})}
                            onChildMouseUp={async () => await this.setState({draggable: !this.state.draggable,hidePopup:false})}
                            onChildMouseMove={this.onCircleInteraction}
                            onClick={this.handleMapClick}
                            draggable={this.state.draggable}
                            yesIWantToUseGoogleMapApiInternals
                            onGoogleApiLoaded={({map, maps}) => this.passMapReference(map, maps)}
                        >
                            {locations && locations.map((location, index) => {
                                return (<MyGreatPlace
                                    hide={this.state.hidePopup}
                                    lat={location.latitude} lng={location.longitude} key={`marker-${index}`}
                                    id={index}
                                    text={index + 1}
                                    handleRightClick={this.handleChildClick}
                                  />);
                            })}
                        </GoogleMapReact>
                    </Container>
                </Card>
            </Grid.Column>
        </Grid>);
    }
}


export default MissionEditModal;
