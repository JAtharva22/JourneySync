import { React, useState } from 'react';
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

    return (
        <>
            <div className='container'>
                <form>
                    <div className="form-group text-center">
                        <input
                            type="text"
                            className="form-control" // Use Bootstrap form-control class
                            id="source"
                            placeholder='Source'
                        />
                    </div>
                    <br/>
                    <div className="form-group text-center"> 
                        <input
                            type="text"
                            className="form-control" // Use Bootstrap form-control class
                            id="destination"
                            placeholder='Destination'
                        />
                    </div>
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