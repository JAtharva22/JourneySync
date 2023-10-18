import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Pages/Login/Login';
import ProfilePage from './Pages/UserProfile/UserProfile';
import Footer from './Components/footer/Footer';
import Home from './Pages/Home/Home';
import HomeInput from './Pages/Home/HomeInput';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
