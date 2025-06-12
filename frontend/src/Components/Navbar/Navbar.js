import { React, useState, useEffect } from "react";
import "./Navbar.css";
import Cookies from "js-cookie";

const Navbar = () => {
  const [authtoken, setAuthToken] = useState(null);

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    setAuthToken(authToken);
  }, []);

  const handleSignout = () => {
    Cookies.remove("authToken");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg ">
      <div className="container-fluid">
        <div>
          <a className="navbar-brand ms-auto font-color" href="/">
            <h1 style={{ marginLeft: "20px", marginTop: "25px" }}>
              JourneySync
            </h1>
          </a>
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="navbar-nav-container">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            <div className="nav-right-section">
              <ul className="navbar-nav">
                <li className="nav-item mx-4">
                  {authtoken ? (
                    <a
                      className="nav-link active btncolor"
                      aria-current="page"
                      href="/"
                      onClick={handleSignout}
                    >
                      Sign Out
                    </a>
                  ) : (
                    <a
                      className="nav-link active btncolor login-btn"
                      aria-current="page"
                      href="/login"
                    >
                      Login
                    </a>
                  )}
                </li>
              </ul>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 profile-menu">
                {authtoken && (
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/profile"
                      id="navbarProfileLink"
                    >
                      <div className="profile-pic">
                        <img
                          src="https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
                          alt="Profile Picture"
                        />
                      </div>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
