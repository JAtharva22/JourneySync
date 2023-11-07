import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from './Pages/Login/Login';
import ProfilePage from './Pages/UserProfile/UserProfile';
import Footer from './Components/footer/Footer';
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import { useState } from 'react';

function App() {
  const [authtoken,setAuthtoken] = useState('')

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!authtoken ? <Login authtoken ={authtoken} setAuthtoken = {setAuthtoken} /> : <Navigate to="/" />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
