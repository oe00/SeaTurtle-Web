import React from "react";

import {withFirebase} from "../../components/Firebase";

import {Button, Card, Container, Modal,} from "semantic-ui-react";


import MissionList from "./MissionList";
import MissionEditModal from "./MissionEditModal";


class MissionManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            loading: false,
            missions: [],
        }
    }

    open = () => {
        this.setState({open: true})
    };

    close = () => {
        this.setState({open: false})
    };

    onListenForDatabase = () => {
        this.setState({loading: true, missions: []});
        this.props.firebase
            .missions()
            .orderBy("name")
            .get().then(snapshot => {
            snapshot.forEach(doc => {
                const missionObject = doc.data();

                if (missionObject) {
                    const mission = {
                        ...missionObject,
                        uid: doc.id,
                    };

                    this.setState({
                        missions: [...this.state.missions, mission],
                        loading: false,
                    });

                } else {
                    this.setState({missions: null, loading: false});
                }
            })
        });

    };

    componentDidMount() {
        this.onListenForDatabase();
    }

    render() {

        const {open, missions} = this.state;

        return (
            <>
                <MissionList refresh={this.onListenForDatabase} missions={missions} {...this.props}/>
                <Card.Content extra>
                    <Button positive onClick={this.open}>Create Mission</Button>
                    <Modal size="fullscreen" open={open} onClose={this.close}
                           closeIcon>
                        <Modal.Header>
                            New Mission
                        </Modal.Header>
                        <Modal.Content>
                            <MissionEditModal refresh={this.onListenForDatabase}
                                              modalClose={this.close} {...this.props}/>
                        </Modal.Content>
                    </Modal>
                </Card.Content>
            </>
        );
    }
}

export default withFirebase(MissionManagement);
