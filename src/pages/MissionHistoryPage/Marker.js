import React, {Component} from "react";


import {Image, Modal, Popup} from "semantic-ui-react";
import {greatPlaceStyle_DRONE} from "./markerStyle";

export default class MyGreatPlace extends Component {

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

        let {imageThumb, imageSource, text, size} = this.props;

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
}
