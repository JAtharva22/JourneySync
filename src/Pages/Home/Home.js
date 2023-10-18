import { React, useState } from 'react';
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
                                        className: 'location-search-input form-control'
                                    })}
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


// const [data, useData] = useState([])
// useEffect(() => {
//     fetch('https://api.tvmaze.com/search/shows?q=all')
//         .then(response => response.json())
//         .then(result => {
//             setData(result);
//         })
//         .catch(error => {
//             console.error(error);
//         });
// }, []); 