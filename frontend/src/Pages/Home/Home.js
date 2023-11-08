import { React, useEffect, useState, useRef } from 'react';
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
            scord: { lat: 19.0269249, lng: 72.8478554 },
            dcord: { lat: 19.0641877, lng: 72.8351758 }
        },
        {
            id: 2,
            name: 'John',
            location: '100 meters',
            number: 22222222222,
            scord: { lat: 19.0322634, lng: 72.8454553 },
            dcord: { lat: 19.0641877, lng: 72.8351758 }
        },
        {
            id: 3,
            name: 'Alice',
            location: '200 meters',
            number: 33333333333,
            scord: { lat: 19.0269249, lng: 72.9478554 },
            dcord: { lat: 12.0641877, lng: 72.8351758 }
        },
        {
            id: 4,
            name: 'Sairaj',
            location: '250 meters',
            number: 98190122023,
            scord: { lat: 19.0549903, lng: 72.840237 },
            dcord: { lat: 19.0644647, lng: 72.8358602 }
        },
        {
            id: 3,
            name: 'Suraj',
            location: '500 meters',
            number: 985151615105,
            scord: { lat: 19.0549903, lng: 72.840237 },
            dcord: { lat: 19.0660073, lng: 72.83450420000001 }
        },
    ]);

    const [listdata, setListdata] = useState([
        {
            id: 1,
            name: 'Nobody Nearby',
            location: '',
            number: "",
            scord: { lat: 19.0269249, lng: 72.8478554 },
            dcord: { lat: 19.0641877, lng: 72.8351758 }
        }]);

    // source coordinates 
    const [address, setAddress] = useState('')
    const [coordinates, setCoordinates] = useState({
        lat: null,
        lng: null
    })

    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const ll = await getLatLng(results[0])
        console.log(ll)
        setAddress(value)
        setCoordinates(ll)
    }

    // destination coordinates 
    const [daddress, setDaddress] = useState('')
    const [dcoord, setDcoord] = useState({
        lat: null,
        lng: null
    })

    const handleSelectDest = async value => {
        const results = await geocodeByAddress(value);
        const ll = await getLatLng(results[0])
        console.log(ll)
        setDaddress(value)
        setDcoord(ll)
    }

    const findCurrent = (e) => {
        e.preventDefault()
        const success = (position) => {
            const newCoordinates = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            setCoordinates(newCoordinates);
            const coordinatesString = `lat: ${newCoordinates.lat}, lng: ${newCoordinates.lng}`;
            console.log(coordinatesString)
            // value={coordinates.lat ? `${coordinates.lat}, ${coordinates.lng}` : ''}

        }
        const errorCurrent = () => {
            console.log('got an error')
        }
        navigator.geolocation.getCurrentPosition(success, errorCurrent)
    }


    function haversineDistance(coord1, coord2) {
        const R = 6371; // Radius of the Earth in kilometers
        const lat1 = (coord1.lat * Math.PI) / 180;
        const lat2 = (coord2.lat * Math.PI) / 180;
        const lon1 = (coord1.lng * Math.PI) / 180;
        const lon2 = (coord2.lng * Math.PI) / 180;

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in kilometers

        return distance;
    }

    function handlesearch(e) {
        e.preventDefault();
        setSearching(true)
        const sourceUser = coordinates; // Target user's coordinates
        const destUser = dcoord;


        const nearbyUsers = [];
        const finalUsers = [];
        const userdataa = [];

        data.forEach(item => {
            const scordObject = item.scord;
            userdataa.push(scordObject);

        });

        for (const user of userdataa) {
            const distance = haversineDistance(sourceUser, user);
            if (distance <= 0.5) { // Check if the distance is less than or equal to 0.5 kilometers (500 meters)
                nearbyUsers.push(user);
            }
        }

        for (let i = 0; i < nearbyUsers.length; i++) {

            const filteredData = data.filter(item => item.scord === nearbyUsers[i]);
            const distance = haversineDistance(destUser, filteredData[0].dcord);
            if (distance <= 0.5) {
                finalUsers.push(filteredData[0]);
            }
        }

        if (finalUsers.length !== 0) {
            setListdata(finalUsers)
        }
    }

    const [searching, setSearching] = useState(false);
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/list/deletelist", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('authToken')
                }
            })
            console.log(localStorage.getItem('authToken'))
            console.log(response.success)
            setSearching(false)
        } catch (error) {
            console.error(error);
            setSearching(false)
            // Handle errors, e.g., display an error message
        }
    };
    return (
        <>
            <div className='container'>
                <form>
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
                                            className: 'location-search-input form-control',
                                        })
                                    }
                                // ref={}
                                // value={coordinates.lat ? `${coordinates.lat}, ${coordinates.lng}` : ''}
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
                        <button type="submit" className="btn btn-primary submit" onClick={handlesearch}>
                            Search
                        </button>
                        {
                            searching && (
                                <button className="btn discard mx-2" onClick={handleDelete}>
                                    Stop Searching
                                </button>
                            )
                        }
                    </div>
                </form>
                <div>
                    {/* map */}
                </div>
                <div>
                    {listdata.map((user) => (
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