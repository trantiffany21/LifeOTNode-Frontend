import React, { Component } from "react";
import { Table, Form, Input, Button, Popup, Modal, Grid, Icon, Header } from 'semantic-ui-react'

export default class POIForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editPOIModalOpen: false,
            newPOIModalOpen: false,
            name: "",
            address: "",
            pois: [],
            poiToEdit: {},
            lat: "",
            long: "",
            apiKey: process.env.REACT_APP_MAPBOX_API_KEY,
            suggestionList: [],
            poiSuggestionModal: false
        }
    }

    getPois = (trip) => {
        fetch(this.props.baseURL + "trips/pois/route/" + trip.id, { credentials: "include" })
            .then(res => {
                return res.json()
            }).then(data => {
                this.setState({
                    pois: data.data
                })
                console.log(this.state.pois[0])
            })
    }
    addPOI = (newPOI) => {
        console.log("newPOI: " + newPOI)
        const copyPOIs = [...this.state.pois]
        copyPOIs.push(newPOI)
        this.setState({
            pois: copyPOIs
        })
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    showEditForm = (poi) => {
        if (this.state.editPOIModalOpen) {
            this.setState({ editPOIModalOpen: false })
        } else {
            this.setState({
                editPOIModalOpen: true,
                name: poi.name,
                address: poi.address,
                poiToEdit: poi
            })
        }
    }
    setNewPOIModal = () => {
        if (this.state.newPOIModalOpen) {
            this.setState({ newPOIModalOpen: false })
        } else {
            this.setState({
                newPOIModalOpen: true,
            })
        }
    }

    setPOIs = (pois) => {
        this.setState({
            pois: pois
        })
    }
    setInput = (name) => {
        this.setState({
            address: name,
            suggestionList: [],
            poiSuggestionModal: false
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const editUrl = this.props.baseURL + 'trips/pois/' + this.state.poiToEdit.id
        try {
            const response = await fetch(editUrl, {
                method: 'PUT',
                body: JSON.stringify({
                    name: e.target.name.value,
                    address: e.target.address.value,
                    trip: this.props.trip.id
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            })

            if (response.status === 200) {
                const updatedPOI = await response.json()
                const findIndex = this.state.pois.findIndex(poi => poi.id === updatedPOI.data.id)
                const copyPOIs = [...this.state.pois]
                copyPOIs[findIndex] = updatedPOI.data
                this.setPOIs(copyPOIs)
                this.setState({
                    editPOIModalOpen: false
                })
            }
        }
        catch (err) {
            console.log('Error => ', err)
        }
    }

    handleAddPOI = (event) => {
        event.preventDefault()
        fetch(this.props.baseURL + 'trips/pois/', {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name,
                address: this.state.address,
                lat: this.state.lat,
                long: this.state.long,
                trip: this.props.trip.id
            }),
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        }).then(res => {
            return res.json()
        }).then(data => {
            this.addPOI(data.data)
            this.setNewPOIModal()
            this.setState({
                name: "",
                address: "",
                lat: "",
                long: "",
            })
        }).catch(error => console.error({ 'Error': error }))
    }

    deletePOI = (id) => {
        fetch(this.props.baseURL + 'trips/pois/' + id, {
            method: 'DELETE',
            credentials: "include"
        }).then(res => {
            const findIndex = this.state.pois.findIndex(poi => poi.id === id)
            const copyPOIs = [...this.state.pois]
            copyPOIs.splice(findIndex, 1)
            this.setPOIs(copyPOIs)
        })
    }

    componentDidMount() {
        this.getPois(this.props.trip)
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

    getMapboxPOI = async (place) => {
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
                    suggestionList: arrPlaces,
                    poiSuggestionModal: true
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

    render() {
        return (
            <div className="POIContainer">
                <Header as='h1'>Points of Interest</Header>
                <Grid container style={{ padding: '2em 0em' }}>
                    <Grid.Row>
                        <h1>{this.props.trip.name}</h1>
                    </Grid.Row>
                    <Grid.Row>
                        <Table definition>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell>Stop Name</Table.HeaderCell>
                                    <Table.HeaderCell>Address</Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.pois.map((poi, i) => {
                                    return (
                                        <Table.Row key={poi.id}>
                                            <Table.Cell collapsing >{i + 1}</Table.Cell>
                                            <Table.Cell>{poi.name}</Table.Cell>
                                            <Table.Cell >{poi.address}</Table.Cell>
                                            <Table.Cell>
                                                <Button.Group basic size="small" floated='right'>
                                                    <Popup size="tiny" content='Edit' trigger={<Button icon='edit' onClick={() => this.showEditForm(poi)} />} />
                                                    <Popup size="tiny" content='Delete Trip' trigger={<Button icon='trash alternate' onClick={() => this.deletePOI(poi.id)} />} />
                                                </Button.Group>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })
                                }
                            </Table.Body>
                            <Table.Footer fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell colSpan='3'>
                                        <Button
                                            floated='right'
                                            icon
                                            labelPosition='left'
                                            primary
                                            size='small'
                                            onClick={()=> this.setNewPOIModal()}>
                                            <Icon name='add circle' /> Add POI
                                        </Button>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Grid.Row>

                    <Modal
                        closeIcon
                        open={this.state.editPOIModalOpen}
                        onClose={() => this.showEditForm()}
                    >
                        <Modal.Header>Edit Trip Details</Modal.Header>
                        <Modal.Content>
                            <Form id="poi-form" onSubmit={this.handleSubmit}>
                                <Form.Field
                                    onChange={(e) => this.handleChange(e)}
                                    id='name'
                                    name='name'
                                    control={Input}
                                    label='Name'
                                    value={this.state.name}
                                />
                                <div>
                                    <Form.Field
                                        onChange={(e) => { this.handleChange(e); this.getMapboxPOI(e) }}
                                        id='address'
                                        name='address'
                                        control={Input}
                                        label='Address'
                                        value={this.state.address}
                                    />
                                    <div className="overlapped">
                                        {this.state.poiSuggestionModal && this.state.suggestionList.map((name, i) => {
                                            return (
                                                <Button.Group widths='3'>
                                                    <Button inverted compact color="instagram" className="ui top attached button" onClick={() => this.setInput(name.address)}>{name.address}</Button>
                                                </Button.Group>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button primary compact
                                form='poi-form'
                                type="submit"
                                content="Edit POI"
                                labelPosition='left'
                                icon='checkmark'
                            />
                        </Modal.Actions>
                    </Modal>

                    <Modal
                        closeIcon
                        open={this.state.newPOIModalOpen}
                        onClose={() => this.setNewPOIModal()}
                        onOpen={() => this.setNewPOIModal()}
                    >
                        <Modal.Header>New Point of Interest Details</Modal.Header>
                        <Modal.Content>
                            <Form id="new-poi-form" onSubmit={this.handleAddPOI}>
                                <Form.Field
                                    onChange={(e) => this.handleChange(e)}
                                    id='name'
                                    name='name'
                                    control={Input}
                                    label='Name'
                                    value={this.state.name}
                                />
                                <div>
                                    <Form.Field
                                        onChange={(e) => { this.handleChange(e); this.getMapboxPOI(e) }}
                                        id='address'
                                        name='address'
                                        control={Input}
                                        label='Address'
                                        value={this.state.address}
                                    />
                                    <div className="overlapped">
                                        {this.state.poiSuggestionModal && this.state.suggestionList.map((name, i) => {
                                            return (
                                                <Button.Group widths='3'>
                                                    <Button inverted compact color="instagram" className="ui top attached button" onClick={() => this.setInput(name.address)}>{name.address}</Button>
                                                </Button.Group>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button positive compact
                                form='new-poi-form'
                                type="submit"
                                content="New POI"
                                labelPosition='left'
                                icon='add'
                            />
                        </Modal.Actions>
                    </Modal>

                </Grid>
            </div>
        );
    }
}