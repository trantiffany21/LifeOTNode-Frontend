import React, { Component } from 'react';
import { Button, Modal, Form, Input, Popup } from 'semantic-ui-react'

export default class EditTrip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            apiKey: process.env.REACT_APP_MAPBOX_API_KEY,
            suggestionList: [],
        }
    }

    getMapboxSuggestions = async (place) => {
        if (place.target.value !== "") {
            let searchWord = place.target.value.replace(/\s/g, '%20')
            let fetchUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchWord + ".json?types=place&access_token=" + this.state.apiKey
            console.log(fetchUrl)
            try {
                const response = await fetch(fetchUrl)
                const data = await response.json()
                console.log(data.features)
                let features = data.features
                const arrPlaces = []
                features.map((name, i) => {
                    arrPlaces.push(name.place_name)
                })
                this.setState({
                    suggestionList: arrPlaces
                })
                console.log(this.state.suggestionList)

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
            console.log(fetchUrl)
            try {
                const response = await fetch(fetchUrl)
                const data = await response.json()
                console.log(data.features)
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
                console.log(this.state.suggestionList)

            } catch (err) {
                console.log('Error => ', err)
            }
        } else {
            this.setState({
                suggestionList: []
            })
        }
    }
    clearSuggestion = () => {
        this.setState({
            suggestionList: []
        })
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
        console.log(this.state.suggestionModal)
    }

    render() {
        return (
            <Modal
                closeIcon
                open={this.props.editModalOpen}
                onClose={() => this.props.setEditModalOpen()}
            >
                <Modal.Header>Edit Trip Details</Modal.Header>
                <Modal.Content>
                    <Form id='edit-trip-form' onSubmit={this.props.handleSubmit}>
                        <Form.Field
                            onChange={(e) => this.props.handleChange(e)}
                            id='name'
                            name='name'
                            control={Input}
                            label='Name'
                            value={this.props.name}
                        />
                        <div>
                            <Form.Field
                                onChange={(e) => { this.props.handleChange(e); this.getMapboxSuggestions(e); this.setSuggestion("origin") }}
                                id='origin'
                                name='origin'
                                control={Input}
                                label='Origin'
                                value={this.props.origin}
                            />
                            <div className="overlapped">
                                {this.state.suggestionModal === "origin" && this.state.suggestionList.map((name, i) => {
                                    return (
                                        <Button.Group widths='3'>
                                            <Button inverted compact color="instagram" className="ui top attached button" onClick={() => { this.props.setInput("origin", name); this.clearSuggestion() }}>{name}</Button>
                                        </Button.Group>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            <Form.Field
                                onChange={(e) => { this.props.handleChange(e); this.getMapboxSuggestions(e); this.setSuggestion("destination") }}
                                id='destination'
                                name='destination'
                                control={Input}
                                label='Destination'
                                value={this.props.destination}
                            />
                            <div className="overlapped">
                                {this.state.suggestionModal === "destination" && this.state.suggestionList.map((name, i) => {
                                    return (
                                        <Button.Group widths='3'>
                                            <Button inverted compact color="instagram" className="ui top attached button" onClick={() => { this.props.setInput("destination", name); this.clearSuggestion() }}>{name}</Button>
                                        </Button.Group>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            <Form.Field
                                onChange={(e) => { this.props.handleChange(e); this.getLodging(e); this.setSuggestion("lodging") }}
                                id='lodgingName'
                                name='lodgingName'
                                control={Input}
                                label='Lodging Name'
                                value={this.props.lodgingName}
                            />
                            <div className="overlapped">
                                {this.state.suggestionModal === "lodging" && this.state.suggestionList.map((name, i) => {
                                    return (
                                        <Button.Group widths='3'>
                                            <Button inverted compact color="instagram" className="ui top attached button" onClick={() => { this.props.setInput("lodging", name); this.clearSuggestion() }}>{name.address}</Button>
                                        </Button.Group>
                                    )
                                })}
                            </div>
                        </div>
                    </Form>
                    <Modal.Actions>
                        <Button primary compact
                            form='edit-trip-form'
                            type="submit"
                            content="Edit Trip"
                            labelPosition='right'
                            icon='checkmark'
                        />
                    </Modal.Actions>
                </Modal.Content>
            </Modal>


        )
    }

}