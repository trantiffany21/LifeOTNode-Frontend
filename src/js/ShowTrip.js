import React, { Component } from "react";
import { Table, Button, Popup } from 'semantic-ui-react'
import POIForm from "./POIForm";
import EditTrip from "./EditTrip";

export default class ShowTrip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editModalOpen: false,
            name: "",
            origin: "",
            destination: "",
            lodgingName: "",
            lodgingAddress: "",
            tripToEdit: {}
        }
    }
    setEditModalOpen = () => {
        if (this.state.editModalOpen) {
            this.setState({ editModalOpen: false })
        } else {
            this.setState({
                editModalOpen: true
            })
        }
    }
    showEditForm = (trip) => {
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

    showPOIForm = (trip) => {
        this.props.setTripModalOpen(false)
        this.props.setPoiModalOpen(true)
        this.setState({
            tripToEdit: trip
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    setInput = (type, name) => {
        if (type === "origin") {
            this.setState({
                origin: name
            })
        } else if (type === "destination") {
            this.setState({
                destination: name
            })
        } else {
            this.setState({
                lodgingName: name.name,
                lodgingAddress: name.address,
                lodgingLat: name.lat,
                lodgingLong: name.long
            })

        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const editUrl = this.props.baseURL + 'trips/' + this.state.tripToEdit.id
        try {
            const response = await fetch(editUrl, {
                method: 'PUT',
                body: JSON.stringify({
                    name: this.state.name,
                    origin: this.state.origin,
                    destination: this.state.destination,
                    lodging: {
                        lodging_name: this.state.lodgingName,
                        lodging_address: this.state.lodgingAddress,
                        lodging_lat: this.state.lodgingLat,
                        lodging_long: this.state.lodgingLong,
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
                {this.props.tripModalOpen &&
                    <Table >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Trip Name</Table.HeaderCell>
                                <Table.HeaderCell>Origin</Table.HeaderCell>
                                <Table.HeaderCell>Destination</Table.HeaderCell>
                                <Table.HeaderCell>Lodging Name</Table.HeaderCell>
                                <Table.HeaderCell>Lodging Address</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
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
                                                <EditTrip showEditForm={this.showEditForm} trip={trip} handleChange={this.handleChange} handleSubmit={this.handleSubmit} name={this.state.name} origin={this.state.origin} destination={this.state.destination} lodgingName={this.state.lodgingName} setInput={this.setInput}/>

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

                {this.props.poiModalOpen && <POIForm baseURL={this.props.baseURL} trip={this.state.tripToEdit} />}
            </div>
        );
    }
}