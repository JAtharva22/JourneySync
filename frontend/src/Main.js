import './App.css';
import {
  useNavigate,
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate
} from "react-router-dom";
import { React, useEffect, useState } from 'react';
import Login from './Pages/Login/Login';
import ProfilePage from './Pages/UserProfile/UserProfile';
import Footer from './Components/footer/Footer';
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';

function Main() {
  const location = useLocation();
  const currentRoute = location.pathname;

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);


  return (
    <>
      {currentRoute !== "/login" && <Navbar />}

      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
      </Routes>
      
      <Footer />
    </>
  )
}

export default Main;
