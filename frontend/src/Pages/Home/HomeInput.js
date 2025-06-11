import {React, useState} from 'react';
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
        </div >
    );
}



export default HomeInput