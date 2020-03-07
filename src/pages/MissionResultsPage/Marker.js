import React from "react";

import {greatPlaceStyle} from "./markerStyle.js";
import {Image, Modal, Popup} from "semantic-ui-react";

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

        let {lat, lng, picture, text,size} = this.props;

        if (this.state.counter === 0) {
            return (
                <Popup
                    on='click'
                    onOpen={this.hs}
                    onClose={this.handleClose}
                    hideOnScroll
                    open={this.state.isOpen}
                    position="top center" content={`Lat:${lat} Long:${lng}`}
                    trigger={<div style={greatPlaceStyle}> {text}</div>}>
                    <Image onClick={this.handleOpen} src="https://firebasestorage.googleapis.com/v0/b/turtle-cloud.appspot.com/o/resultImages-mock%2Fimages.jpg?alt=media&token=dd136f25-3e4f-445c-b3b0-7463a04b74fe"/>
                </Popup>
            );
        } else if (this.state.counter === 1) {
            return (<Modal size={size} open={true} closeIcon onClose={this.handleClose}>
                <Modal.Content  ><Image src="https://firebasestorage.googleapis.com/v0/b/turtle-cloud.appspot.com/o/resultImages-mock%2Fimages.jpg?alt=media&token=dd136f25-3e4f-445c-b3b0-7463a04b74fe"/></Modal.Content>
            </Modal>);
        }

    }
}