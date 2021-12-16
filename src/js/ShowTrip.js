import React, { Component } from "react";
import { Table, Form, Input, Button, Popup } from 'semantic-ui-react'
import POIForm from "./POIForm";

export default class ShowTrip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editModalOpen: false,
            poiModalOpen: false,
            name: "",
            origin: "",
            destination: "",
            lodgingName: "",
            lodgingAddress: "",
            tripToEdit: {}
        }
    }
    showEditForm = (trip) => {
        if (this.state.editModalOpen) {
            this.setState({ editModalOpen: false })
        } else {
            this.setState({
                editModalOpen: true,
                name: trip.name,
                origin: trip.origin,
                destination: trip.destination,
                lodgingName: trip.lodging.lodging_name,
                lodgingAddress: trip.lodging.lodging_address,
                tripToEdit: trip
            })
        }
    }

    showPOIForm = (trip) => {
        if (this.state.poiModalOpen) {
            this.setState({ poiModalOpen: false })
        } else {
            this.props.setShowModal()
            this.setState({
                poiModalOpen: true,
                tripToEdit: trip
            })
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const editUrl = this.props.baseURL + 'trips/' + this.state.tripToEdit.id
        try {
            const response = await fetch(editUrl, {
                method: 'PUT',
                body: JSON.stringify({
                    name: e.target.name.value,
                    origin: e.target.origin.value,
                    destination: e.target.destination.value,
                    lodging: {
                        lodging_name: e.target.lodgingName.value,
                        lodging_address: e.target.lodgingAddress.value,
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            })

            if (response.status === 200) {
                const updatedTrip = await response.json()
                const findIndex = this.props.trips.findIndex(trip => trip.id === updatedTrip.data.id)
                const copyTrips = [...this.props.trips]
                copyTrips[findIndex] = updatedTrip.data
                this.props.setTrips(copyTrips)
                this.setState({
                    editModalOpen: false
                })
            }
        }
        catch (err) {
            console.log('Error => ', err)
        }
    }

    deleteTrip = (id) => {
        fetch(this.props.baseURL + 'trips/' + id, {
            method: 'DELETE',
            credentials: "include"
        }).then(res => {
            const findIndex = this.props.trips.findIndex(trip => trip.id === id)
            const copyTrips = [...this.props.trips]
            copyTrips.splice(findIndex, 1)
            this.props.setTrips(copyTrips)
        })
    }

    render() {
        return (
            <div className="TripContainer">
                {this.props.showModalOpen &&
                    <Table >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Trip Name</Table.HeaderCell>
                                <Table.HeaderCell>Origin</Table.HeaderCell>
                                <Table.HeaderCell>Destination</Table.HeaderCell>
                                <Table.HeaderCell>Lodging Name</Table.HeaderCell>
                                <Table.HeaderCell>Lodging Address</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <tbody>
                            {this.props.trips.map((trip, i) => {
                                return (
                                    <Table.Row key={trip.id}>
                                        <Table.Cell>{trip.name}</Table.Cell>
                                        <Table.Cell>{trip.origin}</Table.Cell>
                                        <Table.Cell>{trip.destination}</Table.Cell>
                                        <Table.Cell>{trip.lodging.lodging_name}</Table.Cell>
                                        <Table.Cell>{trip.lodging.lodging_address}</Table.Cell>
                                        <Table.Cell>
                                            <Button.Group basic size='small'>
                                                <Popup size="tiny" content='Points of Interest' trigger={<Button icon='map outline' onClick={() => this.showPOIForm(trip)} />} />
                                                <Popup size="tiny" content='Edit Trip' trigger={<Button icon='edit' onClick={() => this.showEditForm(trip)} />} />
                                                <Popup size="tiny" content='Delete Trip' trigger={<Button icon='trash alternate' onClick={() => this.deleteTrip(trip.id)} />} />
                                            </Button.Group>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                            }
                        </tbody>
                    </Table>
                }
                {this.state.editModalOpen &&
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Field
                                onChange={(e) => this.handleChange(e)}
                                id='name'
                                name='name'
                                control={Input}
                                label='Name'
                                value={this.state.name}
                            />
                            <Form.Field
                                onChange={(e) => this.handleChange(e)}
                                id='origin'
                                name='origin'
                                control={Input}
                                label='Origin'
                                value={this.state.origin}
                            />
                            <Form.Field
                                onChange={(e) => this.handleChange(e)}
                                id='destination'
                                name='destination'
                                control={Input}
                                label='Destination'
                                value={this.state.destination}
                            />
                        </Form.Group>
                        <Form.Field
                            onChange={(e) => this.handleChange(e)}
                            id='lodgingName'
                            name='lodgingName'
                            control={Input}
                            label='Lodging Name'
                            value={this.state.lodgingName}
                        />
                        <Button primary compact type="submit"> Edit Trip </Button>
                    </Form>
                }

                {this.state.poiModalOpen && <POIForm baseURL={this.props.baseURL} trip={this.state.tripToEdit} />}
            </div>
        );
    }
}