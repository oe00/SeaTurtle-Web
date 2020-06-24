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

    componentDidMount() {
        this.onListenForPiStatus();
    }

    componentWillUnmount(){
        this.props.firebase
            .piStatus().off();
    }

    onListenForPiStatus = () => {
        this.props.firebase
            .piStatus()
            .on("value", snapshot => {
                const piStatus = snapshot.val();
                {
                    this.setState({
                        for_canvas: true,
                    });
                }
            });
    };

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
                                    <h3>{mission["uploaded-images"].length}</h3>
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
                            options={{mapTypeControl: true, mapTypeId: "terrain"}}
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

                function f(p, i) {
                    const c = document.getElementById("myCanvas-" + i);
                    if (c) {
                        var ctx = c.getContext("2d");
                        var img = document.createElement("img");
                        img.setAttribute("src", p.source);
                        ctx.drawImage(img, 10, 10);
                        ctx.font = "30px Arial";
                        ctx.fillStyle = "red";
                        if (p.bounding_boxes) {
                            ctx.beginPath();
                            ctx.lineWidth = 6;
                            ctx.strokeStyle = 'red';
                            p.bounding_boxes.forEach(bb => {
                                ctx.rect(bb.xmin * 1280, bb.ymin * 720,
                                    (bb.xmax - bb.xmin) * 1280,
                                    (bb.ymax - bb.ymin) * 720);
                                ctx.stroke();
                                ctx.fillStyle = 'red';
                                ctx.fillRect(bb.xmin * 1280, bb.ymin * 720-40,250,40)
                                ctx.fillStyle = 'black';
                                ctx.fillText("Sea Turtle " + (bb.score * 100).toFixed(2) + "%",
                                    bb.xmin * 1280, bb.ymin * 720-15);
                            })
                        } else {
                            ctx.fillText("Sea Turtle Not Detected.", 60, 60);
                        }
                    }
                };

                return (<Card.Group itemsPerRow={5}>
                    {pictures.map((picture, i) => (
                        <Modal style={{width:"63.5%"}} closeIcon trigger={<Card style={{color: "#000000"}}>
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
                                    <canvas
                                        style={{
                                          paddingLeft:"0",
                                          paddingRight:"0",
                                          marginLeft:"0",
                                          marginRight:"0",
                                          display:"block",
                                          width:"1000px"
                                        }}
                                        width="1280" height="720" id={"myCanvas-" + i}/>
                                    {f(picture, i)}
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
