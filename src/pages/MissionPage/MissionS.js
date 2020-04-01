import React, {Component} from "react";
import {Button, Card, Container, Dropdown, Grid, Loader} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
import MyGreatPlace from "./Marker";
import MyGreatPlace2 from "../MissionResultsPage/Marker";
import MissionCard from "./MissionCard";
import {withFirebase} from "../../components/Firebase";
import {MAPS_CONFIG} from "../../config";

const mapBorder = {width: "100% ", height: "80vh "};

const defaultCenter = {lat: 35.197970240448015, lng: 33.532330183981806};
const defaultZoom = 8;

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
            firestoreMissionID: null,
            selectedIndex: 0,
            zoom: defaultZoom,
            center: defaultCenter,
            activeMission: null,
            activeMissionID: null,
            resultID: null,
            resultMission: null,
            missionCompleted: false,
            prevMissionName: null,
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

        console.log(locations)

        let locs = locations.map(l => {
            return ({lat: l.latitude, lng: l.longitude})
        });

        if(this.oldPath!=null){
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

    onListenForActiveMission = () => {
        this.props.firebase
            .activeMission()
            .on("value", snapshot => {
                const activeMission = snapshot.val();
                let copyActiveMission = null;

                if (activeMission) {
                    copyActiveMission = Object.keys(activeMission).map(key => ({
                        ...activeMission[key],
                        uid: key,
                    }));
                    this.setState({
                        activeMission: copyActiveMission[0],
                        activeMissionID: copyActiveMission[0].uid,
                        selectedMission: copyActiveMission[0].details,
                        firestoreMissionID: copyActiveMission[0].missionRef,
                        zoom: this.missionZoom(copyActiveMission[0].details, true),
                        center: this.missionCenter(copyActiveMission[0].details),
                    });
                } else {
                    this.setState({
                        activeMission: null,
                        activeMissionID: null,
                        selectedMission: null,
                    });
                }
                this.onListenForMissionHistoryDatabase();
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
                return doc.data();
            });
    };

    onListenForMissionHistoryDatabase = () => {
        this.props.firebase
            .missionHistories()
            .orderBy("loggedAt", "desc")
            .limit(1)
            .get().then(async snapshot => {
            if (!snapshot.empty) {
                const missionObject = snapshot.docs[0].data();
                if (missionObject) {
                    missionObject.details = await this.getMissionDetails(missionObject.missionRef);
                }
                if (missionObject.jobID === this.state.resultID && missionObject.results.state === "Completed") {
                    this.setState({
                        missionCompleted: true,
                        resultMission: missionObject,
                    })
                }
            } else {
                this.setState({missionCompleted: false, resultMission: null})
            }
        })
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
    }

    missionZoom = (mission, isActive) => {

        if (!mission) {
            return defaultZoom;
        }
        let zoom = 20;

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
            firestoreMissionID: value,
            selectedIndex: index,
            center: this.missionCenter(mission),
            zoom: this.missionZoom(mission, false),
        });

        this.renderPolylines(mission.route);

    };

    handleStartMission = () => {
        const {selectedMission,firestoreMissionID} = this.state;

        this.setState({
            zoom: this.missionZoom(selectedMission, true),
            center: this.missionCenter(selectedMission),
        });

        let activeMission = {
            state: "Waiting",
            startTime: new Date().toLocaleTimeString(),
            details: selectedMission,
            picturesTaken: 0,
            progress: 0,
            missionRef: firestoreMissionID,

        };

        this.props.firebase.activeMission().push(activeMission)
            .then(ref => this.setState({activeMission: activeMission, activeMissionID: ref.key}));
    };

    handleCancelMission = () => {

        let selectedMission = this.state.activeMission.details;

        this.props.firebase.activeMissionEdit(this.state.activeMissionID).set(null);

        this.setState({
            selectedMission: selectedMission,
            zoom: this.missionZoom(selectedMission, false),
            center: this.missionCenter(selectedMission),
        })
    }

    handleClearResults = () => {
        this.setState({
            missionCompleted: false,
            resultID: null,
            resultMission: null,
            activeMission: null,
            activeMissionID: null,
            selectedMission: null,
            zoom: defaultZoom,
            center: defaultCenter,
            prevMissionName: null,
        })

        this.renderPolylines([]);
    }

    handleMockMissionFinish = () => {

        let {activeMission, activeMissionID, firestoreMissionID} = this.state;

        let name = activeMission.details.name;

        let mockLocations = activeMission.details.route;

        this.setState({prevMissionName: name});

        delete activeMission.details;
        activeMission.state = "Completed";
        activeMission.progress = 100;
        activeMission.picturesTaken = mockLocations.length;
        activeMission.endTime = new Date().toLocaleTimeString();

        this.setState({resultID: activeMissionID});

        this.props.firebase.missionHistories().add(
            {
                results: activeMission,
                jobID: activeMissionID,
                missionRef: firestoreMissionID,
                loggedAt: new Date(),
                mockLocations,
            }
        );

        this.props.firebase.activeMissionEdit(activeMissionID).update({
            state: "Completed",
            progress: 100
        });

        this.props.firebase.activeMissionEdit(this.state.activeMissionID).set(null);
    }

    render() {

        const {missionCompleted, selectedMission, missionDropDowns, loading, activeMission, zoom, center, resultMission, prevMissionName} = this.state;

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
                                  text={activeMission ? activeMission.details.name : prevMissionName}/>
                        : (<Loader active inline="centered"/>)}
                    {!activeMission ? (selectedMission && (<>
                        <MissionCard mission={selectedMission}/>
                        <Card.Content extra>
                            <Button fluid positive onClick={this.handleStartMission}>Start Mission</Button>
                        </Card.Content>
                    </>)) : (activeMission && <>
                        <MissionCard activeMission mission={activeMission}/>
                        <Card.Content extra>
                            <Button.Group fluid>
                                <Button negative onClick={this.handleCancelMission}>Cancel Mission</Button>
                                <Button color="blue" onClick={this.handleMockMissionFinish}>Mock Mission Finish</Button>
                            </Button.Group>
                        </Card.Content>
                    </>)}
                    {missionCompleted && (<>
                        <MissionCard resultMission mission={resultMission.results}/>
                        <Card.Content extra>
                            <Button.Group fluid>
                                <Button positive onClick={this.handleClearResults}>Clear Results</Button>
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
                                options={{mapTypeControl:true,mapTypeId:"terrain"}}
                                yesIWantToUseGoogleMapApiInternals
                                onGoogleApiLoaded={({map,maps}) => this.passMapReference(map,maps)}
                            >
                                {selectedMission && selectedMission.route.map((location, index) => {
                                    return (<MyGreatPlace
                                        lat={location.latitude} lng={location.longitude} id={location.id}
                                        text={index + 1}
                                    />);
                                })}
                                {resultMission && resultMission.details.route.map((location, index) => {
                                    return (<MyGreatPlace2
                                        lat={location.latitude} lng={location.longitude} id={location.id}
                                        text={index + 1} size={""}
                                    />);
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
