import React, { Component } from "react";
import { Form, Input, Button, Grid, Divider, Segment, Header, Image, Container } from 'semantic-ui-react'
import NewTrip from './NewTrip'
import ShowTrip from './ShowTrip'
import routeImg from '../imgs/route.png'

let baseURL = process.env.REACT_APP_BASEURL

export default class UserLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            trips: [],
            userFormType: "login",

        }
    }

    getTrips = () => {
        try {
            fetch(baseURL + "trips/", { credentials: "include" })
            .then(res => {
                return res.json()
            }).then(data => {
                this.setState({
                    trips: data.data
                })
                this.props.setTripModalOpen(true)
            })
        }
        catch (err) {
            this.props.clearUser()
            this.setUserForm("")
            console.log('Error => ' + err)
        }
    }

    addTrips = (newTrip) => {
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
            return (
                <Grid container className="center" style={{ padding: '10em 0em' }}>

                    <NewTrip userId={this.props.userId} baseURL={baseURL} addTrips={this.addTrips} tripModalOpen={this.props.tripModalOpen} setTripModalOpen={this.props.setTripModalOpen} />

                    <ShowTrip userId={this.props.userId} addTrips={this.addTrips} trips={this.state.trips} baseURL={baseURL} setTrips={this.setTrips} tripModalOpen={this.props.tripModalOpen} setTripModalOpen={this.props.setTripModalOpen} poiModalOpen={this.props.poiModalOpen} setPoiModalOpen={this.props.setPoiModalOpen} />
                </Grid>
            )
        } else {
            return (
                <Segment.Group>
                    <Segment>
                        <Container style={{ marginBottom: '5em' }}></Container>
                        <Header as='h2' textAlign='center'>
                        <Image src={routeImg}/> 
                                </Header>
                    </Segment>
                    <Segment>
                        <Grid style={{ height: '50vh' }} columns={2} relaxed='very' stackable textAlign='center' verticalAlign='top'>
                            <Grid.Column style={{ maxWidth: 450 }}>
                                <Header as='h2' textAlign='center'>
                                    Register for account
                                </Header>
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
                                <Header as='h2' textAlign='center'>
                                     Login to your account
                                </Header>
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
                </Segment.Group>
            );
        }
    }
}