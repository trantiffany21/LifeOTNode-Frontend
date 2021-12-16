import React, { Component } from "react";
import { Form, Input, Button, Grid , Divider,Segment,Modal} from 'semantic-ui-react'
import NewTrip from './NewTrip'
import ShowTrip from './ShowTrip'

let baseURL = process.env.REACT_APP_BASEURL

export default class UserLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModalOpen: true,
            trips: [],
            userFormType: "login",
            
        }
    }
    setShowModal = () =>[
        this.setState({showModalOpen: !this.state.showModalOpen})
    ]

    getTrips = () => {
        try{fetch(baseURL + "trips/", { credentials: "include" })
            .then(res => {
                return res.json()
            }).then(data => {
                this.setState({
                    trips: data.data
                })
                console.log("trips: " + this.state.trips)
            })}
        catch(err){
            this.props.clearUser()
            this.setUserForm("")
            console.log('Error => '+ err)
        }
    }

    addTrips = (newTrip) => {
        console.log("newtrip: " + newTrip)
        const copyTrips = [...this.state.trips]
        copyTrips.push(newTrip)
        this.setState({
            trips: copyTrips
        })
    }
    setTrips = (trips) => {
        this.setState({
            trips: trips
        })
    }
    setUserForm = (type) => {
        this.setState({
            userFormType: type
        })
    }

    // setUser = (user) => {
    //     this.setState({
    //         userLoggedIn: true,
    //         username: user.username,
    //         userId: user.id,
    //         email: user.email
    //     })
    //     this.getTrips()
    // }
    // clearUser = () => {
    //     this.setState({
    //         userLoggedIn: false,
    //         userFormType: "",
    //         username: "",
    //         userId: "",
    //         email: ""
    //     })
    // }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const regUrl = baseURL + 'auth/' + 'register'
        fetch(regUrl, {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }),
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data.status === 201) {
                this.props.setUser(data.data)
                this.setUserForm("")
                this.getTrips()
            }
        }).catch(error => console.error({ 'Error': error }))
    }
    
    handleLogin = (event) => {
        event.preventDefault()
        fetch(baseURL + 'auth' + '/login', {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }),
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data.status === 200) {
                this.props.setUser(data.data)
                this.setUserForm("")
                this.getTrips()
            }
        }).catch(error => console.error({ 'Error': error }))
    }
    

    render() {
        if (this.props.userLoggedIn) {
            return(
                <Grid container style={{ padding: '2em 0em' }}>
                {this.state.showModalOpen &&
                    <Modal
                    closeIcon
                    trigger={<Button positive>+ New Trip</Button>}
                    actions={{ key: 'done', content: 'Done', positive: true }}
                >
                    <Modal.Header>New Trip Details</Modal.Header>
                    <Modal.Content>
                            <NewTrip userId={this.props.userId} baseURL={baseURL} addTrips={this.addTrips} />
                            </Modal.Content>
                </Modal>
                }
                    <Grid.Row>
                        <ShowTrip trips={this.state.trips} baseURL={baseURL} setTrips={this.setTrips} showModalOpen={this.state.showModalOpen} setShowModal={this.setShowModal}/>
                    </Grid.Row>
                </Grid>
            )
        } else {
            return (
                <Segment placeholder>
                        <Grid columns={2} relaxed='very' stackable textAlign='center' verticalAlign='middle'>
                        <Grid.Column style={{ maxWidth: 450 }}>
                        <Form onSubmit={this.handleSubmit}>
                                <Form.Field
                                    onChange={(e) => this.handleChange(e)}
                                    id='form-input-register-username'
                                    icon='user'
                                    iconPosition='left'
                                    control={Input}
                                    name="username"
                                    placeholder='Enter Username'
                                />
                                <Form.Field
                                    onChange={(e) => this.handleChange(e)}
                                    id='form-input-register-email'
                                    control={Input}
                                    icon='address card'
                                    iconPosition='left'
                                    name="email"
                                    placeholder='Enter Email'
                                />
                                <Form.Field
                                    onChange={(e) => this.handleChange(e)}
                                    id='form-input-register-password'
                                    icon='lock'
                                    iconPosition='left'
                                    control={Input}
                                    type="password"
                                    name="password"
                                    placeholder='Enter Password'
                                />
                            <Button primary compact type="submit">Register</Button>
                        </Form>
                        </Grid.Column>
                        <Grid.Column style={{ maxWidth: 450 }}>
                        <Form className="" onSubmit={this.handleLogin}>
                                <Form.Field
                                    onChange={(e) => this.handleChange(e)}
                                    id='form-input-control-username'
                                    icon='user'
                                    iconPosition='left'
                                    control={Input}
                                    name="username"
                                    placeholder='Enter Username'
                                />
                                <Form.Field
                                    onChange={(e) => this.handleChange(e)}
                                    id='form-input-control-password'
                                    icon='lock'
                                    iconPosition='left'
                                    control={Input}
                                    type="password"
                                    name="password"
                                    placeholder='Enter Password'
                                />
                            <Button primary compact type="submit">Login</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
                <Divider vertical>Or</Divider>
                    



                </Segment>
            );
        }
    }
}