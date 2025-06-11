import { React, useState, useEffect, useCallback } from 'react';
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

    // Source state
    const [sourceInput, setSourceInput] = useState('');
    const [sourceSuggestions, setSourceSuggestions] = useState([]);
    const [sourcePlaceId, setSourcePlaceId] = useState('');
    const [sourceCoordinates, setSourceCoordinates] = useState({
        lat: null,
        lng: null
    });

    // Destination state
    const [destinationInput, setDestinationInput] = useState('');
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [destinationPlaceId, setDestinationPlaceId] = useState('');
    const [destinationCoordinates, setDestinationCoordinates] = useState({
        lat: null,
        lng: null
    });

    const [activeInput, setActiveInput] = useState(null); // 'source' or 'destination'
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Debounced API call for location suggestions
    const fetchSuggestions = async (input, type) => {
        if (input.length < 3) {
            if (type === 'source') setSourceSuggestions([]);
            if (type === 'destination') setDestinationSuggestions([]);
            return;
        }
        
        setLoadingSuggestions(true);
        try {
            const response = await fetch(`http://localhost:5000/api/suggestion/suggestions?input=${input}`);
            const data = await response.json();
            console.log(data);
            if (type === 'source') {
                setSourceSuggestions(data || []);
            } else {
                setDestinationSuggestions(data || []);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    // Handle input change with debounce
    const handleInputChange = (value, type) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        
        if (type === 'source') {
            setSourceInput(value);
            setActiveInput('source');
        } else {
            setDestinationInput(value);
            setActiveInput('destination');
        }
        
        // Set new debounce timer
        setDebounceTimer(setTimeout(() => {
            fetchSuggestions(value, type);
        }, 500));
    };

    // Handle suggestion selection
    const handleSelectSuggestion = async (suggestion, type) => {
        if (type === 'source') {
            setSourceInput(suggestion.name);
            setSourcePlaceId(suggestion.place_id);
            setSourceSuggestions([]);
        } else {
            setDestinationInput(suggestion.name);
            setDestinationPlaceId(suggestion.place_id);
            setDestinationSuggestions([]);
        }
    };

    // function to find current location of user
    const findCurrent = (e) => {
        e.preventDefault()
        const success = (position) => {
            const newCoordinates = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            setSourceCoordinates(newCoordinates);
            setSourceInput(`${newCoordinates.lat.toFixed(6)}, ${newCoordinates.lng.toFixed(6)}`);
        }
        const errorCurrent = () => {
            console.log('Error getting location')
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
        const src = {
            place_id: sourcePlaceId,
            coordinates: {
                lat: sourceCoordinates.lat,
                lng: sourceCoordinates.lng
            }
        };
        const dest = {
            place_id: destinationPlaceId
        };
        
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

            const responsepost = await response.json();
            console.log(responsepost);
        } catch (error) {
            console.log(error)
        }
    };

    // get filtered list from backend for final results
    // SEARCH button click will call this function
    const getlistdataapi = async (e) => {
        const src = {
            place_id: sourcePlaceId,
            coordinates: {
                lat: sourceCoordinates.lat,
                lng: sourceCoordinates.lng
            }
        };
        const dest = {
            place_id: destinationPlaceId
        };
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
        const responselist = await response.json();

        for (let i = 0; i < responselist.length; i++) {
            const user = await fetchUserByIdApi(responselist[i].userId);
            responselist[i].name = user.name;
            responselist[i].phone = user.phone;
        }
        
        if (responselist.length !== 0) {
            setListdata(responselist);
        } else {
            setListdata([{
                userId: "654a1669d81865efe35106c3",
                name: 'Nobody nearby for a ride',
            }]);
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

        // Check if both sourcePlaceId and sourceCoordinates are empty
        const noPlaceId = !sourcePlaceId || sourcePlaceId.trim() === '';
        const noCoords = !sourceCoordinates.lat || !sourceCoordinates.lng;

        if (noPlaceId && noCoords) {
            alert('Cannot search without a source location.');
            return;
        }

        if (!destinationPlaceId) {
            alert('Please select a valid destination.');
            return;
        }
        console.log(searching)
        setSearching(true);
        getlistdataapi();
        postuserlistapi();
    }

    return (
        <>
            <div className='container'>
                <form>
                    <div className="form-group">
                        <label>From</label>
                        <input
                            value={sourceInput}
                            onChange={(e) => handleInputChange(e.target.value, 'source')}
                            onFocus={() => setActiveInput('source')}
                            placeholder="Source"
                            className="location-search-input form-control"
                        />
                        
                        {activeInput === 'source' && (sourceSuggestions.length > 0 || loadingSuggestions) && (
                            <div className="autocomplete-dropdown-container">
                                {loadingSuggestions && <div>Loading...</div>}
                                    {sourceSuggestions.map((suggestion) => (
                                        <div 
                                            key={suggestion.place_id}
                                            className="suggestion-item"
                                            onClick={() => handleSelectSuggestion(suggestion, 'source')}
                                        >
                                            {suggestion.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                    <br />

                    <div className='text-center'>
                        <button onClick={findCurrent} className="btn btn-success ">
                            Get Your Location
                        </button>
                    </div>

                    <br />
                    <div className="form-group">
                        <label>To</label>
                        <input
                            value={destinationInput}
                            onChange={(e) => handleInputChange(e.target.value, 'destination')}
                            onFocus={() => setActiveInput('destination')}
                            placeholder="Destination"
                            className="location-search-input form-control"
                        />
                        
                        {activeInput === 'destination' && (destinationSuggestions.length > 0 || loadingSuggestions) && (
                            <div className="autocomplete-dropdown-container">
                                {loadingSuggestions && <div>Loading...</div>}
                                    {destinationSuggestions.map((suggestion) => (
                                        <div 
                                            key={suggestion.place_id}
                                            className="suggestion-item"
                                            onClick={() => handleSelectSuggestion(suggestion, 'destination')}
                                        >
                                            {suggestion.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

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
                    {searching && listdata.map((user) => (
                        <div className="container ribbonbody " key={user.userId} >
                            <h3 className="namecss">
                                <span>{user.name}</span>

                            </h3>
                            <div className="container">
                                <div className="ribbon">
                                    {/* <div className="col-4">
                                        <span>{user.number}</span>
                                    </div> */}
                                    {
                                        user.phone == '' ? (
                                            <></>
                                        ) : (
                                            <div className="col-4 text-center">
                                                <p>{user.phone}</p>
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
