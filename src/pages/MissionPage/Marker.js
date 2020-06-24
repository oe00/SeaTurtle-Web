import React from "react";

import {greatPlaceStyle, greatPlaceStyle_DRONE} from "./markerStyle.js";
import {Card, Image, Modal, Popup, Segment, SegmentGroup} from "semantic-ui-react";
import drone_image from "../../drone.png";
import turt from "../../turt.ico";

export default class MyGreatPlace extends React.Component {

    state = {isOpen: false, counter: 0};

    handleOpen = () => {
        this.setState({isOpen: true, counter: this.state.counter + 1});

    };

    hs = () => {
        this.setState({isOpen: true});

    };

    handleClose = () => {
        this.setState({isOpen: false, counter: 0});
    };

    render() {

        let {lat, lng, picture,isPicture, text, drone} = this.props;

        if (isPicture) {
            if (this.state.counter === 0) {

                return (
                    picture.bounding_boxes ?
                        <Popup
                            style={{margin: "0", padding: "0"}}
                            on='click'
                            onOpen={this.hs}
                            onClose={this.handleClose}
                            hideOnScroll
                            open={this.state.isOpen}
                            position="bottom center"
                            trigger={<div style={greatPlaceStyle_DRONE}><Image src={turt}/></div>}>
                            <Image onClick={this.handleOpen} src={picture.thumbnail}/>
                        </Popup>
                        :
                    <Popup
                        on='click'
                        onOpen={this.hs}
                        onClose={this.handleClose}
                        hideOnScroll
                        open={this.state.isOpen}
                        position="bottom center"
                        trigger={<div style={greatPlaceStyle_DRONE}></div>}>
                        <Image onClick={this.handleOpen} src={picture.thumbnail}/>
                    </Popup>
                );
            } else if (this.state.counter === 1) {

                function f(p) {
                    const c = document.getElementById("myCanvas-" + p.timestamp);
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

                return (<Modal style={{width: "64%"}} open={true} closeIcon onClose={this.handleClose}>
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
                </Modal>);
            }


        } else if (drone) {
            return (
                <Popup style={{padding: "0"}} disabled={this.props.hide} hideOnScroll position="top center"
                       trigger={<div style={greatPlaceStyle_DRONE}><Image src={drone_image}/></div>}>
                    <Popup.Content as={SegmentGroup} style={{margin: "0"}} horizontal compact size="small">
                        <Segment><h3>{lat.toFixed(4)}</h3>Latitude</Segment>
                        <Segment><h3>{lng.toFixed(4)}</h3>Longitude</Segment>
                    </Popup.Content>
                </Popup>
            );
        } else if (text !== null && this.state.counter === 0) {
            return (
                <Popup style={{padding: "0"}} disabled={this.props.hide} hideOnScroll position="top center"
                       trigger={<div style={greatPlaceStyle}> {text}</div>}>
                    <Popup.Content as={SegmentGroup} style={{margin: "0"}} horizontal compact size="small">
                        <Segment><h3>{lat.toFixed(4)}</h3>Latitude</Segment>
                        <Segment><h3>{lng.toFixed(4)}</h3>Longitude</Segment>
                    </Popup.Content>
                </Popup>
            );
        }

    }
}
