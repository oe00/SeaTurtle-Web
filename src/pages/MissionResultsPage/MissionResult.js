import React from "react";

import {withFirebase} from "../../components/Firebase";

import {Container,} from "semantic-ui-react";

import MissionList from "./MissionList";

class MissionResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            missions: [],
        }
    }

    getMissionDetails = (mid) => {
        return this.props.firebase
            .mission(mid)
            .get().then(doc => {
                return doc.data();
            });
    };

    onListenForMissionHistoriesDatabase = () => {
        this.setState({loading: true, missions: []});
        this.props.firebase
            .missionHistories()
            .orderBy("loggedAt", "desc")
            .get().then(snapshot => {
            snapshot.forEach(async doc => {
                const missionObject = doc.data();

                if (missionObject) {
                    const mission = {
                        ...missionObject,
                        uid: doc.id,
                    };

                    mission.details = await this.getMissionDetails(mission.missionRef);

                    this.setState({
                        missions: [...this.state.missions, mission],
                        loading: false,
                    });

                } else {
                    this.setState({missions: [], loading: false});
                }
            })
        });

    };

    componentDidMount() {
        this.onListenForMissionHistoriesDatabase();
    }

    render() {
        const {missions} = this.state;

        return (
            <MissionList refresh={this.onListenForMissionHistoriesDatabase} missions={missions} {...this.props}/>
        );
    }
}

export default withFirebase(MissionResult);
