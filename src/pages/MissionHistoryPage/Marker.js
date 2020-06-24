import React, {Component} from "react";


import {Card, Image, Modal, Popup, Segment} from "semantic-ui-react";
import {greatPlaceStyle_DRONE} from "./markerStyle";
import turt from "../../turt.ico";

export default class MyGreatPlace extends Component {

    state = {isOpen: false, counter: 0};

    handleOpen = () => {
        this.setState({isOpen: true, counter: this.state.counter + 1});

    };

    popupOpen = () => {
        this.setState({isOpen: true});

    };

    handleClose = () => {
        this.setState({isOpen: false, counter: 0});
    };

    render() {

        let {picture, text} = this.props;

        if (this.state.counter === 0) {
            return (
                picture.bounding_boxes ?
                    <Popup
                        style={{margin: "0", padding: "0"}}
                        on='click'
                        onOpen={this.popupOpen}
                        onClose={this.handleClose}
                        hideOnScroll
                        open={this.state.isOpen}
                        position="bottom center"
                        trigger={<div style={greatPlaceStyle_DRONE}><Image src={turt}/></div>}>
                        <Card onClick={this.handleOpen} style={{color: "#000000"}}>
                            <Image wrapped src={picture.thumbnail}></Image>
                            <Segment.Group style={{marginTop: "0", marginBottom: "0"}} compact horizontal>
                                <Segment><h2 style={{textAlign: "center"}}>{text}</h2></Segment>
                                <Segment>
                                    <h4>{new Date(picture.timestamp).toLocaleTimeString()}</h4>
                                    Timestamp
                                </Segment>
                            </Segment.Group>
                        </Card>
                    </Popup>
                    :
                    <Popup
                        style={{margin: "0", padding: "0"}}
                        on='click'
                        onOpen={this.popupOpen}
                        onClose={this.handleClose}
                        hideOnScroll
                        open={this.state.isOpen}
                        position="bottom center"
                        trigger={<div style={greatPlaceStyle_DRONE}></div>}>
                        <Card onClick={this.handleOpen} style={{color: "#000000"}}>
                            <Image wrapped src={picture.thumbnail}></Image>
                            <Segment.Group style={{marginTop: "0", marginBottom: "0"}} compact horizontal>
                                <Segment><h2 style={{textAlign: "center"}}>{text}</h2></Segment>
                                <Segment>
                                    <h4>{new Date(picture.timestamp).toLocaleTimeString()}</h4>
                                    Timestamp
                                </Segment>
                            </Segment.Group>
                        </Card>
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

            return <Modal style={{width:"64%"}} open={true} closeIcon onClose={this.handleClose}>
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
                        width="1280" height="720" id={"myCanvas-" + picture.timestamp}/>
                    {f(picture)}
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
            </Modal>;
        }

    }
}


