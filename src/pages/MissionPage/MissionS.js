import React, {Component} from "react";
import {Button, Card, Container, Dropdown, Grid, Loader, Segment} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
import MyGreatPlace from "./Marker";
import MyGreatPlace2 from "../MissionHistoryPage/Marker";
import MissionCard from "./MissionCard";
import {withFirebase} from "../../components/Firebase";
import {MAPS_CONFIG} from "../../config";
import DroneStatusCard from "../../components/DroneStatusCard";
import {longitudeKeys} from "geolib/es/constants";

const mapBorder = {width: "100% ", height: "80vh"};

const defaultCenter = {lat: 35.197970240448015, lng: 33.532330183981806};
const defaultZoom = 9;

class MissionS extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            limit: 50,
            missions: [],
            missionDropDowns: [],
            locations: [],
            selectedMission: null,
            zoom: defaultZoom,
            center: defaultCenter,
            activeMission: null,
            resultID: null,
            resultMission: null,
            missionCompleted: false,
            prevMissionName: null,
            droneStatus: null,
        };
    }

    componentDidMount() {
        this.onListenForMissionsDatabase();
        this.onListenForActiveMission();
    }

    testMapAPI = null;
    testMap = null;
    oldPath = null;

    passMapReference(map, maps) {
        this.testMap = map;
        this.testMapAPI = maps;
    }

    renderPolylines(locations) {

        let maps = this.testMapAPI;

        if (maps) {
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

    }

    onListenForDroneStatus = () => {
        this.props.firebase
            .droneStatus()
            .on("value", snapshot => {
                const droneStatus = snapshot.val();

                if (droneStatus) {
                    this.setState({
                        droneStatus: droneStatus,
                    });
                } else {
                    this.setState({
                        droneStatus: null,
                    });
                }
            });
    };

    onListenForActiveMission = () => {
        this.props.firebase
            .activeMission()
            .on("value", async snapshot => {
                const activeMission = snapshot.val();

                if (activeMission && activeMission.mission_state!=="Finished") {

                    let mission = await this.getMissionDetails(activeMission.mission_ref);

                    let images = [];
                    if (activeMission["uploaded-images"]) {
                        images = Object.keys(activeMission["uploaded-images"]).map(key => ({
                            ...activeMission["uploaded-images"][key],
                        }));
                    }

                    mission.state = activeMission.mission_state;
                    mission.picturesTaken = images.length;


                    this.setState({
                        activeMission: mission,
                        selectedMission: mission,
                        center: this.missionCenter(mission),
                        zoom: this.missionZoom(mission, true),
                    });

                    this.onListenForDroneStatus();
                    this.renderPolylines(mission.route);


                } else {
                    if (activeMission && activeMission.mission_state === "Finished") {
                        this.setState({
                            activeMission: null,
                            selectedMission: null,
                            zoom: defaultZoom,
                            center: defaultCenter,
                        });
                        this.renderPolylines([]);
                    }
                };
            });
    };

    onListenForMissionsDatabase = () => {
        this.setState({loading: true});
        this.props.firebase
            .missions()
            .orderBy("name", "desc")
            .get().then(snapshot => {
            snapshot.forEach(doc => {
                const missionObject = doc.data();

                if (missionObject) {
                    const mission = {
                        ...missionObject,
                        uid: doc.id,
                    };

                    const missionDropDown = {
                        key: doc.id,
                        text: mission.name,
                        value: doc.id,
                    }

                    if (mission.isAllowed) {
                        this.setState({
                            missions: [mission, ...this.state.missions],
                            missionDropDowns: [missionDropDown, ...this.state.missionDropDowns],
                            loading: false,
                        });
                    } else {
                        this.setState({loading: false, noResults: true});
                    }

                } else {
                    this.setState({missions: null, missionDropDowns: null, loading: false});
                }
            })
        });

    };

    getMissionDetails = (mid) => {
        return this.props.firebase
            .mission(mid)
            .get().then(doc => {
                let details = doc.data();
                if (details) {
                    details.uid = mid;
                    return details;
                }
            });
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

    missionZoom = (mission, isActive) => {

        if (!mission) {
            return defaultZoom;
        }

        let zoom = defaultZoom;

        if (mission.distance > 0) {
            zoom = 19;
        }

        if (mission.distance > 1) {
            zoom = 16;
        }
        if (mission.distance > 2) {
            zoom = 15;
        }
        if (mission.distance > 4) {
            zoom = 14;
        }
        if (mission.distance > 8) {
            zoom = 13;
        }
        return isActive ? zoom + 1 : zoom;
    };

    updateSelected = (event, {selected, value}) => {

        const index = this.state.missions.findIndex(i => i.uid === value);

        const mission = this.state.missions[index];

        this.setState({
            selectedMission: mission,
            center: this.missionCenter(mission),
            zoom: this.missionZoom(mission, false),
        });

        this.renderPolylines(mission.route);

    };

    componentWillUnmount() {
        this.props.firebase
            .droneStatus().off();
        this.props.firebase
            .activeMission().off();
    }

    handleStartMission = () => {

        const {selectedMission} = this.state;

        if (selectedMission) {
            const waypoints = selectedMission.route.map(w => {
                return {altitude: 10, latitude: w.latitude, longitude: w.longitude}
            });

            const activeMission = {
                mission_ref: selectedMission.uid,
                mission_state: "Pending",
                waypoints
            };

            this.props.firebase.activeMission().set(activeMission);

            this.setState({
                zoom: this.missionZoom(selectedMission, true),
                center: this.missionCenter(selectedMission),
                activeMission: selectedMission,
            });
        }
    };

    handleClearResults = () => {
        this.setState({
            activeMission: null,
            selectedMission: null,
            zoom: defaultZoom,
            center: defaultCenter,
        });

        this.renderPolylines([]);

    };

    render() {

        const {droneStatus, selectedMission, missionDropDowns, loading, activeMission, zoom, center, resultMission, prevMissionName} = this.state;


        return (
            <Grid columns={2}>
                <Grid.Column width={4}>
                    {(!loading) ? (!activeMission && !resultMission) ?
                        <Dropdown fluid scrolling
                                  className="h2"
                                  search selection
                                  onChange={this.updateSelected}
                                  text={selectedMission ? selectedMission.name : prevMissionName ? prevMissionName : "Select Mission"}
                                  options={missionDropDowns}/>
                        :
                        <Dropdown fluid
                                  className="h2"
                                  search selection
                                  disabled
                                  text={activeMission ? activeMission.name : prevMissionName}/>
                        : (<Loader active inline="centered"/>)}
                    {!activeMission ? (selectedMission && (<>
                        <MissionCard mission={selectedMission}/>
                        <DroneStatusCard/>
                        <Card.Content extra>
                            <Button fluid positive onClick={this.handleStartMission}>Start Mission</Button>
                        </Card.Content>
                    </>)) : (activeMission && <>
                        <MissionCard activeMission mission={activeMission}/>
                        <DroneStatusCard/>
                        <Card.Content extra>
                            <Button.Group fluid>
                                <Button positive disabled={activeMission.state!=="Finished"}
                                        onClick={this.handleClearResults}>Clear
                                    Mission</Button>
                            </Button.Group>
                        </Card.Content>
                    </>)}
                </Grid.Column>
                <Grid.Column width={12}>
                    <Card fluid>
                        <Container style={mapBorder}>
                            <GoogleMapReact
                                bootstrapURLKeys={MAPS_CONFIG}
                                center={center}
                                zoom={zoom}
                                options={{mapTypeControl: true, mapTypeId: "terrain"}}
                                yesIWantToUseGoogleMapApiInternals
                                onGoogleApiLoaded={({map, maps}) => this.passMapReference(map, maps)}
                            >
                                {selectedMission && selectedMission.route.map((location, index) => {
                                    return (<MyGreatPlace
                                        lat={location.latitude} lng={location.longitude} id={location.id}
                                        text={index + 1}
                                    />);
                                })}
                                {activeMission && droneStatus && <MyGreatPlace drone
                                                                               lat={droneStatus.location.latitude}
                                                                               lng={droneStatus.location.longitude}
                                                                               id={"Drone Marker"}
                                                                               text={"Drone"}
                                />
                                }
                                {resultMission && resultMission.details.route.map((location, index) => {
                                    return (<MyGreatPlace2
                                        lat={location.latitude} lng={location.longitude} id={location.id}
                                        text={index + 1}/>);
                                })}
                            </GoogleMapReact>
                        </Container>
                    </Card>
                </Grid.Column>
            </Grid>
        );
    }
}

export default withFirebase(MissionS);
