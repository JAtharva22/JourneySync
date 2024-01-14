import { React, useState } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import './Homeinput.css'
import './Home.css';
import Cookies from 'js-cookie';

function Home() {
    const [authtoken, setAuthtoken] = useState(Cookies.get('authToken'));
    const [searching, setSearching] = useState(false);

    const [listdata, setListdata] = useState([{
            userId: "654a1669d81865efe35106c3",
            name: 'Nobody nearby for a ride',
            phone: '',
            scord: { lat: 19.0549903, lng: 72.840237 },
            dcord: { lat: 19.0660073, lng: 72.83450420000001 }
        },
    ]);

    // source coordinates 
    const [address, setAddress] = useState('')
    const [coordinates, setCoordinates] = useState({
        lat: null,
        lng: null
    })

    const handleSelectSrc = async value => {
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

    // function to find current location of user
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


    //-------------------------------------------------------------------------------------------------------
    const fetchUserByIdApi = async (userId) => {
        //post request
        const response = await fetch("http://localhost:5000/api/auth/getuserbyid", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'userId': userId,
                'auth-token': authtoken
            }
        })
        const user = await response.json()
        return user
    };
    //---------------------------------------------------------------------------------------------------------

    // post user in master list
    const postuserlistapi = async () => {
        const src = [coordinates.lng, coordinates.lat];
        const dest = [dcoord.lng, dcoord.lat];
        //post request
        console.log(src)
        try {
            const response = await fetch("http://localhost:5000/api/list/addlist", {
                method: 'POST',
                body: JSON.stringify({
                    src, dest
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authtoken
                }
            })

            var responsepost = await response.json()
            console.log(responsepost)
        } catch (error) {
            console.log(error)
        }
    };

    // get filtered list from backend for final results
    const getlistdataapi = async (e) => {
        const src = [coordinates.lng, coordinates.lat];
        const dest = [dcoord.lng, dcoord.lat];
        //post request
        const response = await fetch("http://localhost:5000/api/list/getlist", {
            method: 'POST',
            body: JSON.stringify({
                src, dest
            }),
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        })
        var responselist = await response.json()

        for (let i = 0; i < responselist.length; i++) {

            const user = await fetchUserByIdApi(responselist[i].userId);
            responselist[i].name = user.name
            responselist[i].phone = user.phone
        }
        if (responselist.length !== 0) {
            setListdata(responselist)
        } else {
            setListdata([{
                userId: "654a1669d81865efe35106c3",
                name: 'Nobody nearby for a ride',
                scord: { lat: 19.0549903, lng: 72.840237 },
                dcord: { lat: 19.0660073, lng: 72.83450420000001 }
            },
            ])
        }

    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/list/deletelist", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authtoken
                }
            })
            setSearching(false)
            setListdata([{
                userId: "654a1669d81865efe35106c3",
                name: 'Nobody nearby for a ride',
                phone: '',
                scord: { lat: 19.0549903, lng: 72.840237 },
                dcord: { lat: 19.0660073, lng: 72.83450420000001 }
            }])
        } catch (error) {
            console.error(error);
            setSearching(false)
            // Handle errors, e.g., display an error message
        }
    };
    //------------------------------------------------------------------------------------------

    // function to handle search whenever user clicks search for different users    
    async function handlesearch(e) {
        e.preventDefault();
        setSearching(true)
        getlistdataapi();
        postuserlistapi();
    }

    return (
        <>
            <div className='container'>
                <form>
                    <PlacesAutocomplete
                        value={address}
                        onChange={setAddress}
                        onSelect={handleSelectSrc}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div className="form-group ">
                                <input
                                    {...getInputProps({
                                        placeholder: 'Source',
                                        className: 'location-search-input form-control'
                                    })}
                                // value = {coordinates.lat + ', ' + coordinates.lng}
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
                    {listdata.map((user) => (
                        <div className="container ribbonbody " key={user.userId} >
                            <h3 className="namecss">
                                <span>{user.name}</span>

                            </h3>
                            <div className="container">
                                <div className=" ribbon">
                                    {/* <div className="col-4">
                                        <span>{user.number}</span>
                                    </div> */}
                                    {
                                        user.phone == '' ? (
                                            <></>
                                        ) : (
                                            <div className="col-4 text-center">
                                                <a className='btn phonebtn' href={'tel:' + user.phone}>
                                                    Phone
                                                </a>
                                            </div>

                                        )
                                    }
                                    {/* <div className="col-4 text-right">
                                        <span>{user.location}</span>
                                    </div> */}
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