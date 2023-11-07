import './App.css';
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import Login from './Pages/Login/Login';
import ProfilePage from './Pages/UserProfile/UserProfile';
import Footer from './Components/footer/Footer';
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';

function Main() {
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <>
      {currentRoute !== "/login" && <Navbar/>}      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </>
  );
}
export default Main;
