import {React, useState} from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import './Homeinput.css'

function HomeInput() {

    const [daddress, setDaddress] = useState('')
    const [dcoord, setDcoord] = useState({
        lat : null,
        lng : null
    })

    const handleSelectDest = async value =>{
        const results = await geocodeByAddress(value);
        const ll = await getLatLng(results[0])
        console.log(ll)
        setDaddress(value)
        setDcoord(ll)
    }

    return (
        <div>
            <p>
                lat : {dcoord.lat}
            </p>
            <p>
                lng : {dcoord.lng}
            </p>
            <p>
                Address : {daddress}
            </p>
            <PlacesAutocomplete
                value={daddress}
                onChange={setDaddress}
                onSelect={handleSelectDest}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div key={suggestions.description} className="form-group text-center">
                        <input
                            {...getInputProps({
                                placeholder: 'Source . . .',
                                className: 'location-search-input form-control'
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                // inline style for demonstration purpose
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
        </div >
    );
}



export default HomeInput