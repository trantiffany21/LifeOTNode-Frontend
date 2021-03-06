import React, { Component } from "react";
import { Table, Form, Input, Button, Popup, Modal, Grid, Icon, Header } from 'semantic-ui-react'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY


export default class POIForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editPOIModalOpen: false,
            newPOIModalOpen: false,
            mapModalOpen: false,
            name: "",
            address: "",
            pois: [],
            poiToEdit: {},
            lat: "",
            long: "",
            apiKey: process.env.REACT_APP_MAPBOX_API_KEY,
            suggestionList: [],
            mapLodgingName: this.props.trip.lodging.lodging_name,
            mapLodgingLong: this.props.trip.lodging.lodging_long,
            mapLodgingLat: this.props.trip.lodging.lodging_lat,
            poiSuggestionModal: false,
            optimzedModal: false
        }
        this.mapContainer = React.createRef();
    }

    getPois = (trip) => {
        fetch(this.props.baseURL + "trips/pois/route/" + trip.id, { credentials: "include" })
            .then(res => {
                return res.json()
            }).then(data => {
                this.setState({
                    pois: data.data
                })
            })
    }
    addPOI = (newPOI) => {
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
                name: "",
                address: "",
                lat: "",
                long: ""
            })
        }
    }
    setMapModal = () => {

        if (this.state.mapModalOpen) {
            this.setState({ mapModalOpen: false })
        } else {
            this.setState({
                mapModalOpen: true,
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
            address: name.address,
            lat: name.lat,
            long: name.long,
            suggestionList: [],
            poiSuggestionModal: false
        })
    }

    handleEdit = async (e) => {
        e.preventDefault()
        const editUrl = this.props.baseURL + 'trips/pois/' + this.state.poiToEdit.id
        try {
            const response = await fetch(editUrl, {
                method: 'PUT',
                body: JSON.stringify({
                    name: this.state.name,
                    address: this.state.address,
                    lat: this.state.lat,
                    long: this.state.long,
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
                this.showMap(updatedPOI.data)
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
            this.showMap(data.data)
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

    getMapboxPOI = async (place) => {
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
                    suggestionList: arrPlaces,
                    poiSuggestionModal: true
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

    showMap = (poi) => {

        let lng = poi.long
        let lat = poi.lat
        let zoom = 15
        const mapName = poi.address.split(',')[0]
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        const marker = new mapboxgl.Marker({
            color: "#0E6EB8",
            draggable: false
        }).setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML("<Message compact verticalAlign='middle' className='map-text'>" + mapName + "</Message>")) // add popup
            .addTo(map);
        marker.togglePopup()
    }

    getPoiCoordinates = (pois) => {
        let starting = [this.state.mapLodgingLong, this.state.mapLodgingLat]
        let coordinateString = [starting]
        this.state.pois.map((poi, i) => {
            let tempCoordinate = [poi.long, poi.lat]
            coordinateString.push(tempCoordinate)

        })
        return coordinateString.join(';')


    }

    reorderPOIs = (pois, waypoints) =>{
        const copyPOIs = [...this.state.pois]
        const orderedPOIs = copyPOIs.map((poi,i) =>{
            const newPOI = poi
            newPOI.waypoint = waypoints[i].waypoint_index
            return newPOI
        })
        orderedPOIs.sort((a, b) => (a.waypoint > b.waypoint) ? 1 : -1)
        this.setState({pois: orderedPOIs, optimzedModal: true})
    }

    optimize = async () => {
        let lng = this.state.mapLodgingLong
        let lat = this.state.mapLodgingLat
        let zoom = 12
        const mapName = this.state.mapLodgingName


        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
     
        const query = await "https://api.mapbox.com/optimized-trips/v1/mapbox/driving/" + this.getPoiCoordinates(this.state.pois) + "?access_token=" + process.env.REACT_APP_MAPBOX_API_KEY

        const response = await fetch(query, {
            method: 'GET'
          });
        const data = await response.json()

        const poisArr = [...this.state.pois]
        this.reorderPOIs(poisArr, data.waypoints.slice(1))
        
        const routeMarkers = data.waypoints.map((point, i)=>{
            let stopName = ""
            if(i===0 ){
                stopName = "STOP #" + point.waypoint_index + " " + this.state.mapLodgingName
            }else{
                stopName = "STOP # " + point.waypoint_index + " " +  poisArr[i-1].address
            }
            
              return new mapboxgl.Marker({
                color: "#B03060",
                draggable: false
            }).setLngLat(point.location)
                .setPopup(new mapboxgl.Popup().setHTML("<Message compact verticalAlign='middle' className='map-text'>" + stopName + "</Message>")) // add popup
                .addTo(map);
          })
          
    }

    componentDidMount() {
        this.getPois(this.props.trip)


    }

    render() {
        return (
            <div className="POIContainer">
                <Header as='h1'>Points of Interest <Icon name='map signs' /></Header>
                <Grid container style={{ padding: '2em 0em' }}>
                    <Grid.Row>
                        <h1> {this.props.trip.name}</h1>
                    </Grid.Row>
                    <Grid.Row>
                        <Table definition>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell>Stop Name</Table.HeaderCell>
                                    <Table.HeaderCell>Address</Table.HeaderCell>
                                    {this.state.optimzedModal && <Table.HeaderCell style={{ color: '#016936' }}>Optimized <Icon name='clipboard check' />
                                    </Table.HeaderCell>}
                                    {!this.state.optimzedModal && <Table.HeaderCell> 
                                    </Table.HeaderCell>}
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
                                                    <Popup size="tiny" content='Map It' trigger={<Button icon='map marker alternate' onClick={() => this.showMap(poi)} />} />
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
                                        {this.state.pois.length>0 &&
                                        <Button
                                            floated='right'
                                            icon
                                            labelPosition='left'
                                            positive
                                            size='small'
                                            onClick={() => this.optimize()}>
                                            <Icon name='shipping fast' /> Optimize Trip!
                                        </Button>}
                                        {this.state.pois.length <=10 &&
                                        <Button
                                            floated='right'
                                            icon
                                            labelPosition='left'
                                            primary
                                            size='small'
                                            onClick={() => this.setNewPOIModal()}>
                                            <Icon name='add circle' /> Add POI
                                        </Button>}
                                        {this.state.pois.length ===11 && <Button
                                            floated='right'
                                            icon
                                            labelPosition='left'
                                            primary
                                            size='small'
                                            disabled>
                                            <Icon name='add circle' /> Max POI Reached
                                        </Button>}
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
                            <Form id="poi-form" onSubmit={this.handleEdit}>
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
                                                    <Button inverted compact color="instagram" className="ui top attached button" onClick={() => this.setInput(name)}>{name.address}</Button>
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
                                                    <Button inverted compact color="instagram" className="ui top attached button" onClick={() => this.setInput(name)}>{name.address}</Button>
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
                <div ref={this.mapContainer} className="map-poi" />
            </div >
        );
    }
}
