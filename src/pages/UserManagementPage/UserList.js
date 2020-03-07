import React, {Component} from "react";

import {withFirebase} from "../../components/Firebase";


import {Card, Dropdown, Loader, Table} from "semantic-ui-react";

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
            userDropdownOptions: [{key: 1, text: "Admin", value: "Admin"},
                {key: 2, text: "Expert", value: "Expert"},
                {key: 3, text: "Operator", value: "Operator"},],
        };

        this.updateSelected = this.updateSelected.bind(this);
    }

    onListenForDatabase = () => {
        this.setState({loading: true, users: []});
        this.props.firebase
            .users()
            .get().then(snapshot => {
            snapshot.forEach(doc => {
                const userObject = doc.data();

                if (userObject) {
                    const user = {
                        ...userObject,
                        uid: doc.id,
                    };

                    this.setState({
                        users: [user, ...this.state.users],
                        loading: false,
                    });

                } else {
                    this.setState({users: null, loading: false});
                }
            })
        });

    };

    componentDidMount() {
        this.onListenForDatabase();
    }

    updateSelected = (user, value) => {
        this.props.firebase.user(user.uid).update(
            {
                role: value
            }).then(this.onListenForDatabase);
    };


    render() {
        const {users, loading, userDropdownOptions} = this.state;

        return (loading ? (
                <Loader active inline/>
            ) : (
                <Card fluid>
                    <Card.Content>
                        <Table celled compact>
                            <Table.Header fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell>Email</Table.HeaderCell>
                                    <Table.HeaderCell>Role</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {users && users.map((user, i) => (
                                    <Table.Row key={i}>
                                        <Table.Cell>{user.email}</Table.Cell>
                                        <Table.Cell collapsing>
                                            <Dropdown fluid scrolling
                                                      className="h2"
                                                      selection
                                                      onChange={() => this.updateSelected(user, getSelection().anchorNode.textContent)}
                                                      text={user.role}
                                                      options={userDropdownOptions}/>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Card.Content>
                </Card>
            )
        )
            ;
    }
}

export default withFirebase(UserList);


//                                                <Table.Cell>{mission.route.map((point, index) => <Button size="tiny"
//                                                     key={index}>{point.latitude.toFixed(2)},{point.longitude.toFixed(2)}</Button>)}</Table.Cell>
