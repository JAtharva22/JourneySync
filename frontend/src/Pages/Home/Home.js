import { React, useState, useEffect } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import './Homeinput.css'
import './Home.css';

function Home() {
    const [data, setData] = useState([
        {
            id: 1,
            name: 'Om',
            location: '50 meters',
            number: 11111111111,
        },
        {
            id: 2,
            name: 'John',
            location: '100 meters',
            number: 22222222222,
        },
        {
            id: 3,
            name: 'Alice',
            location: '200 meters',
            number: 33333333333,
        },
    ]);


    useEffect(() => {
        fetch('http://localhost:5000/')
            .then(response => response.json())
            .then(userIDs => {
                console.log(userIDs)
                // const filteredData = data.filter(user => userIDs.includes(user.id));
                // console.log(filteredData)
                // setData(filteredData);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // source coordinates 
    const [address, setAddress] = useState('')
    const [coordinates, setCoordinates] = useState({
        srclat: null,
        srclng: null
    })

    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const ll = await getLatLng(results[0])
        console.log(ll)
        setAddress(value)
        setCoordinates(ll)
    }
    // get current location
    const findCurrent = (e) => {
        e.preventDefault()
        const success = (position) => {
            const newCoordinates = {
                srclat: position.coords.latitude,
                srclng: position.coords.longitude,
            };
            setCoordinates(newCoordinates);
            const coordinatesString = `lat: ${newCoordinates.srclat}, lng: ${newCoordinates.srclng}`;
            console.log(coordinatesString)
        }
        const errorCurrent = () => {
            console.log('got an error')

        }
        navigator.geolocation.getCurrentPosition(success, errorCurrent)
    }

    // destination coordinates 
    const [daddress, setDaddress] = useState('')
    const [dcoord, setDcoord] = useState({
        destlat: null,
        destlng: null
    })

    const handleSelectDest = async value => {
        const results = await geocodeByAddress(value);
        const ll = await getLatLng(results[0])
        console.log(ll)
        setDaddress(value)
        setDcoord({
            destlat: ll.lat,
            destlng: ll.lng
        })
    }

    // handleSubmit
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = {
            ...coordinates,
            ...dcoord,
        };
        console.log(dataToSend)

        fetch('http://localhost:5000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(dataToSend), // Convert the data to JSON format
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Handle the API response data
            })
            .catch((error) => {
                // Handle errors
                console.error('Error:', error);
            });

    }

    return (
        <>
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <PlacesAutocomplete
                        value={address}
                        onChange={setAddress}
                        onSelect={handleSelect}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div className="form-group ">
                                <input
                                    {...getInputProps({
                                        placeholder: 'Source',
                                        className: 'location-search-input form-control'
                                    })}
                                    // value={coordinates.srclat ? `${coordinates.srclat} and ${coordinates.srclng}` : ''}
                                />
                                <div key={suggestions.description} className="autocomplete-dropdown-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map(suggestion => {
                                        const className = suggestion.active
                                            ? 'suggestion-item--active'
                                            : 'suggestion-item';
                                        return (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                    className
                                                })}
                                            >
                                                <span>{suggestion.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
                    <br />

                    <div className='text-center'>
                        <button onClick={findCurrent} className="btn btn-success ">
                            Get Your Location
                        </button>
                    </div>

                    <br />
                    <PlacesAutocomplete
                        value={daddress}
                        onChange={setDaddress}
                        onSelect={handleSelectDest}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div className="form-group">
                                <input
                                    {...getInputProps({
                                        placeholder: 'Destination',
                                        className: 'location-search-input form-control'
                                    })}
                                />
                                <div key={suggestions.description} className="autocomplete-dropdown-container zcheck">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map(suggestion => {
                                        const className = suggestion.active
                                            ? 'suggestion-item--active'
                                            : 'suggestion-item';
                                        return (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                    className,
                                                })}
                                            >
                                                <span>{suggestion.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>

                    {/* search button */}
                    <div className="text-center"> {/* Center the button */}
                        <button type="submit" className="btn btn-primary submit">
                            Search
                        </button>
                    </div>
                </form>
                <br />
                <div>
                    {/* map */}
                </div>
                <div>
                    {data.map((user) => (
                        <div className="container ribbonbody " key={user.id}>
                            <h3 className="namecss">
                                <span>{user.name}</span>
                            </h3>
                            <div className="container">
                                <div className="row ribbon">
                                    <div className="col-4">
                                        <span>{user.number}</span>
                                    </div>
                                    <div className="col-4 text-center">
                                        <button className='btn'>
                                            Chat
                                        </button>
                                    </div>
                                    <div className="col-4 text-right">
                                        <span>{user.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Home;
