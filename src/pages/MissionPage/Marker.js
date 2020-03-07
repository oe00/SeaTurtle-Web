import React from "react";

import {greatPlaceStyle} from "./markerStyle.js";
import {Image, Modal, Popup, Segment} from "semantic-ui-react";

export default class MyGreatPlace extends React.Component {

  state = { isOpen: false, counter: 0 };

  handleOpen = () => {
    this.setState({ isOpen: true, counter: this.state.counter + 1 });

  };

  hs = () => {
    this.setState({ isOpen: true});

  };

  handleClose = () => {
    this.setState({ isOpen: false, counter: 0 });
  };

  render() {

    let { lat, lng, picture, text } = this.props;

    if (text == null && this.state.counter===0) {
      text = "+";
      return (
        <Popup
          on='click'
          onOpen={this.hs}
          onClose={this.handleClose}
          hideOnScroll
          open={this.state.isOpen}
          position="top center" content={`Lat:${lat} Long:${lng}`}
          trigger={<div style={greatPlaceStyle}> {text}</div>}>
          <Image onClick={this.handleOpen} src={picture.thumbnail}/>
        </Popup>
      );
    } else if (text !== null && this.state.counter===0) {
      return (
        <Popup hideOnScroll size="tiny" position="top center"
               trigger={<div style={greatPlaceStyle}> {text}</div>}>
        <Segment.Group horizontal compact>
          <Segment><h3>Latitude</h3>{lat.toFixed(4)}</Segment>
          <Segment><h3>Longitude</h3>{lng.toFixed(4)}</Segment>
        </Segment.Group>
        </Popup>
      );
    }
    else if(this.state.counter===1)
    {
      return (<Modal open={true} closeIcon onClose={this.handleClose}>
        <Modal.Content><Image src={picture.source}/></Modal.Content>
      </Modal>);
    }

  }
}
