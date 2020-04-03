import React, {Component} from "react";

import {withFirebase} from "../../components/Firebase";

import {Button, Card, Grid, Icon,} from "semantic-ui-react";


class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            commands: [],
        };
    }

    componentDidMount() {
        this.onListenForCommands();
    }

    onListenForCommands = () => {
        this.setState({loading: true});

        this.props.firebase
            .commandQueue()
            .orderByChild("createdAt")
            .on("value", snapshot => {
                const commandObject = snapshot.val();

                if (commandObject) {
                    const commandList = Object.keys(commandObject).map(key => ({
                        ...commandObject[key],
                        uid: key,
                    }));

                    this.setState({
                        commands: commandList.reverse(),
                        loading: false,
                    });

                } else {
                    this.setState({commands: null, loading: false});
                }
            });

    };

    render() {
        return (
            <Grid>
                <Grid.Column width={3}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>
                                <h2>Drone Status</h2>
                            </Card.Header>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center">
                                        <Icon bordered size="small" name="wifi"/>
                                        Connection Status</Card.Header>
                                </Card.Content>
                                <Button fluid size="small" disabled color="green"> Active</Button>
                            </Card>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center"><Icon bordered size="small"
                                                                          name="battery full"/> Remaining
                                        Battery</Card.Header>
                                </Card.Content>
                                <Button fluid size="small" color="grey" disabled> {"90%"}</Button>
                            </Card>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center"><Icon bordered size="small"
                                                                          name="hdd"/> Remaining
                                        Storage</Card.Header>
                                </Card.Content>
                                <Button fluid size="small" disabled color="blue"> {"15 GB"}</Button>
                            </Card>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center"><Icon bordered size="small"
                                                                          name="play"/> Mission Status</Card.Header>
                                </Card.Content>
                                <Button fluid size="small" disabled color="red"> {"Not Running"}</Button>
                            </Card>
                        </Card.Content>
                    </Card>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>
                                <h2>Pi Status</h2>
                            </Card.Header>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center">
                                        <Icon bordered size="small" name="wifi"/>
                                        Connection Status</Card.Header>
                                </Card.Content>
                                <Button fluid size="small" disabled color="green"> Active</Button>
                            </Card>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center"><Icon bordered size="small"
                                                                          name="battery full"/> Remaining
                                        Battery</Card.Header>
                                </Card.Content>
                                <Button fluid size="small" color="grey" disabled> {"90%"}</Button>
                            </Card>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center"><Icon bordered size="small"
                                                                          name="hdd"/> Remaining
                                        Storage</Card.Header>
                                </Card.Content>
                                <Button fluid size="small" disabled color="blue"> {"15 GB"}</Button>
                            </Card>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header textAlign="center"><Icon bordered size="small"
                                                                          name="play"/> Mission Status</Card.Header>
                                </Card.Content>
                                <Button fluid size="small" disabled color="red"> {"Not Running"}</Button>
                            </Card>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
        )
    };
}

export default withFirebase(Dashboard);
