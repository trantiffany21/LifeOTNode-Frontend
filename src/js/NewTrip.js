import React, { Component } from "react";
import { Form, Input, Button, Modal } from "semantic-ui-react";

export default class NewTrip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            origin: "",
            destination: "",
            lodgingName: "",
            lodgingAddress: "",
            lodgingLat: "",
            lodgingLong: "",
            apiKey: process.env.REACT_APP_MAPBOX_API_KEY,
            suggestionList: [],
        }
    }
    getMapboxSuggestions = async (place) => {
        if (place.target.value !== "") {
            let searchWord = place.target.value.replace(/\s/g, '%20')
            let fetchUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchWord + ".json?types=place&access_token=" + this.state.apiKey
            try {
                const response = await fetch(fetchUrl)
                const data = await response.json()
                let features = data.features
                const arrPlaces = []
                features.map((name, i) => {
                    arrPlaces.push(name.place_name)
                })
                this.setState({
                    suggestionList: arrPlaces
                })

            } catch (err) {
                console.log('Error => ', err)
            }
        } else {
            this.setState({
                suggestionList: []
            })
        }
    }

    getLodging = async (place) => {
        if (place.target.value !== "") {
            let searchWord = place.target.value.replace(/\s/g, '%20')
            let fetchUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchWord + ".json?types=poi%2Caddress&access_token=" + this.state.apiKey
            try {
                const response = await fetch(fetchUrl)
                const data = await response.json()
                let features = data.features
                const arrPlaces = []
                features.map((name, i) => {
                    arrPlaces.push({
                        name: name.text,
                        address: name.place_name,
                        long: name.geometry.coordinates[0],
                        lat: name.geometry.coordinates[1]
                    })
                })
                this.setState({
                    suggestionList: arrPlaces
                })

            } catch (err) {
                console.log('Error => ', err)
            }
        } else {
            this.setState({
                suggestionList: []
            })
        }
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    setInput = (type, name) => {
        if (type === "origin") {
            this.setState({
                origin: name,
                suggestionList: []
            })
        } else if (type === "destination") {
            this.setState({
                destination: name,
                suggestionList: []
            })
        } else {
            this.setState({
                lodgingName: name.name,
                lodgingAddress: name.address,
                lodgingLat: name.lat,
                lodgingLong: name.long,
                suggestionList: []
            })

        }
    }
    setSuggestion = (type) => {
        if (type === "origin") {
            this.setState({
                suggestionModal: "origin"
            })
        } else if (type === "destination") {
            this.setState({
                suggestionModal: "destination"
            })
        } else {
            this.setState({
                suggestionModal: "lodging"
            })

        }
    }
    handleSubmit = (event) => {
        event.preventDefault()
        fetch(this.props.baseURL + 'trips/', {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name,
                origin: this.state.origin,
                destination: this.state.destination,
                lodging: {
                    lodging_name: this.state.lodgingName,
                    lodging_address: this.state.lodgingAddress,
                    lodging_lat: this.state.lodgingLat,
                    lodging_long: this.state.lodgingLong
                },
                user: this.props.userId
            }),
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        }).then(res => {
            return res.json()
        }).then(data => {
            this.props.addTrips(data.data)
            this.props.setNewTripItem()
            this.props.showMap(data.data)
            this.setState({
                name: "",
                origin: "",
                destination: "",
                lodgingName: "",
                lodgingAddress: "",
                lodgingLat: "",
                lodgingLong: ""
            })
        }).catch(error => console.error({ 'Error': error }))
    }
    render() {
        return (
            <div className="NewTripContainer">
                <Modal
                    closeIcon
                    open={this.props.newTripItem}
                    onClose={() => this.props.setNewTripItem()}
                    onOpen={() => this.props.setNewTripItem()}
                >
                    <Modal.Header>New Trip Details</Modal.Header>
                    <Modal.Content>
                        <Form id="new-trip-form" onSubmit={this.handleSubmit}>
                            <Form.Field
                                onChange={(e) => this.handleChange(e)}
                                id='name'
                                name='name'
                                control={Input}
                                label='Name'
                                value={this.state.name}
                            />
                            <div >
                                <Form.Field
                                    onChange={(e) => { this.handleChange(e); this.getMapboxSuggestions(e); this.setSuggestion("origin") }}
                                    id='origin'
                                    name='origin'
                                    control={Input}
                                    label='Origin'
                                    value={this.state.origin}
                                />
                                <div className="overlapped">
                                    {this.state.suggestionModal === "origin" && this.state.suggestionList.map((name, i) => {
                                        return (
                                            <Button.Group widths='3'>
                                                <Button inverted compact color="instagram" className="ui top attached button" onClick={() => this.setInput("origin", name)}>{name}</Button>
                                            </Button.Group>
                                        )
                                    })}
                                </div>
                            </div>
                            <div>
                                <Form.Field
                                    onChange={(e) => { this.handleChange(e); this.getMapboxSuggestions(e); this.setSuggestion("destination") }}
                                    id='destination'
                                    name='destination'
                                    control={Input}
                                    label='Destination'
                                    value={this.state.destination}
                                />
                                <div className="overlapped">
                                    {this.state.suggestionModal === "destination" && this.state.suggestionList.map((name, i) => {
                                        return (
                                            <Button.Group widths='3'>
                                                <Button inverted compact color="instagram" className="ui top attached button" onClick={() => this.setInput("destination", name)}>{name}</Button>
                                            </Button.Group>
                                        )
                                    })}
                                </div>
                            </div>
                            <Form.Field
                                onChange={(e) => { this.handleChange(e); this.getLodging(e); this.setSuggestion("lodging") }}
                                id='lodgingName'
                                name='lodgingName'
                                control={Input}
                                label='Lodging Name'
                                value={this.state.lodgingName}
                            />
                            <div className="overlapped">
                                {this.state.suggestionModal === "lodging" && this.state.suggestionList.map((name, i) => {
                                    return (
                                        <Button.Group widths='3'>
                                            <Button inverted compact color="instagram" className="ui top attached button" onClick={() => this.setInput("lodging", name)}>{name.address}</Button>
                                        </Button.Group>
                                    )
                                })}
                            </div>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive compact
                            form='new-trip-form'
                            type="submit"
                            content="New Trip"
                            labelPosition='left'
                            icon='add'
                        />
                    </Modal.Actions>
                </Modal>

            </div>
        );
    }
}