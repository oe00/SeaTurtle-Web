import React, {Component} from "react";


import {Card, Image, Modal, Popup, Segment} from "semantic-ui-react";
import {greatPlaceStyle_DRONE} from "./markerStyle";

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
                <Popup
                    style={{margin: "0", padding: "0"}}
                    on='click'
                    onOpen={this.popupOpen}
                    onClose={this.handleClose}
                    hideOnScroll
                    open={this.state.isOpen}
                    position="bottom center"
                    trigger={<div style={greatPlaceStyle_DRONE}>{text}</div>}>
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
            return <Modal open={true} closeIcon onClose={this.handleClose}>
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
            </Modal>;
        }

    }
}


