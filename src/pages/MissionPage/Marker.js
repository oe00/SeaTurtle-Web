import React from "react";

import {greatPlaceStyle, greatPlaceStyle_DRONE} from "./markerStyle.js";
import {Image, Modal, Popup, Segment, SegmentGroup} from "semantic-ui-react";
import drone_image from "../../drone.png";

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

        let {lat, lng, picture, text, drone} = this.props;

        let {imageThumb, imageSource, size} = this.props;


        if (picture) {
            if (this.state.counter === 0) {
                return (
                    <Popup
                        on='click'
                        onOpen={this.hs}
                        onClose={this.handleClose}
                        hideOnScroll
                        open={this.state.isOpen}
                        position="bottom center"
                        trigger={<div style={greatPlaceStyle_DRONE}> {text}</div>}>
                        <Image onClick={this.handleOpen} src={imageThumb}/>
                    </Popup>
                );
            } else if (this.state.counter === 1) {
                return (<Modal size={size} open={true} closeIcon onClose={this.handleClose}>
                    <Modal.Content><Image src={imageSource}/></Modal.Content>
                </Modal>);
            }


        }

        else if (drone) {
            return (
                <Popup style={{padding: "0"}} disabled={this.props.hide} hideOnScroll position="top center"
                       trigger={<div style={greatPlaceStyle_DRONE}><Image src={drone_image}/></div>}>
                    <Popup.Content as={SegmentGroup} style={{margin: "0"}} horizontal compact size="small">
                        <Segment><h3>{lat.toFixed(4)}</h3>Latitude</Segment>
                        <Segment><h3>{lng.toFixed(4)}</h3>Longitude</Segment>
                    </Popup.Content>
                </Popup>
            );
        }

        else if (text !== null && this.state.counter === 0) {
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
