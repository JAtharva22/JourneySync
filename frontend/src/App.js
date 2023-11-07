import './App.css';
import {useLocation, BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from './Pages/Login/Login';
import ProfilePage from './Pages/UserProfile/UserProfile';
import Footer from './Components/footer/Footer';
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Main from './Main.js';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

export default App;
