import React from 'react';
import './Footer.css';  

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer_top">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-3 col-md-6 col-lg-3">
                            <div className="footer_widget">
                                <img
                                    src={require('./jsync_logo.png')}
                                    alt="Your Logo"
                                    className="footer_logo"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                />
                                <br />
                                <h3 className="footer_title" style={{ textAlign: 'center' }}>
                                    JourneySync
                                </h3>
                                <p className="footer_text" style={{ textAlign: 'center' }}>
                                    JourneySync was developed and designed for College Project in 2023 with the collaboration
                                    of a team of three members.
                                </p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 col-lg-3">
                            <div className="footer_widget">
                                <h3 className="footer_title">
                                    Quick Links
                                </h3>
                                <ul>
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/chat">Chat</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 col-lg-3">
                            <div className="footer_widget">
                                <h3 className="footer_title">
                                    Address
                                </h3>
                                <p className="footer_text"> Mumbai, Maharashtra <br /> 400016, IN</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 col-lg-3">
                            <div className="footer_widget">
                                <h3 className="footer_title">
                                    Newsletter
                                </h3>
                                <form action="#" className="newsletter_form">
                                    <input type="text" placeholder="Enter your mail" />
                                    <button type="submit">Sign Up</button>
                                </form>
                                <p className="newsletter_text">Subscribe newsletter to get updates</p>
                                <div className="socail_links">
                                    <ul>
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-facebook-square fa-2x" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-twitter fa-2x" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-instagram fa-2x" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copy-right_text">
                <div className="container">
                    <div className="footer_border" />
                    <div className="row">
                        <div className="col-12">
                            <p className="copy_right">
                                {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                                Copyright © All rights reserved 2023| JourneySync
                                {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;