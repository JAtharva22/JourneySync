import {React, useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import './Landing.css';

function Home() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const authToken = Cookies.get('authToken');
      if (authToken) {
        setIsAuthenticated(true);
      }
    }, []);

  const backgroundStyle = {
    backgroundImage: 'url("https://martech.org/wp-content/uploads/2017/09/Customer-Journey.png")', // Corrected URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height:'100vh',    
  };

  return (
    <div className="landing" style={backgroundStyle}>
      <div className="content">
        <h1 className='heading'>Welcome Aboard!</h1>
        <p className='para'>Connecting fellow travellers across the map. <br/> JourneySync allows you to meet neaby users going to the same destination.</p>
        <button className='next'>
            {
                isAuthenticated ? (
                    <a href='/search'>Learn More</a>
                ) : (
                    <a href='/login'>Learn More</a>
                )
            }
        </button>
      </div>
    </div>
  );
}

export default Home;