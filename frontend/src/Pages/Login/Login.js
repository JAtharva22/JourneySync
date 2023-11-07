import React, { useState } from 'react'
import './Login.css'

function Login({authtoken, setAuthtoken}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [age, setAge] = useState('')
    const [name, setName] = useState('')
    const [gender, setGender] = useState('')

    const handleSubmitLogin = async(e) => {
        
        e.preventDefault();
      
        //post request
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            body: JSON.stringify({
                email, password
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        var token = await response.json()
        setAuthtoken(token.authtoken)
      };

      const handleSubmitRegister = async(e) => {
        
        e.preventDefault();
        
        //post request
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            body: JSON.stringify({
                email, password, age, name, gender
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        var token = await response.json()
        console.log(token.authtoken)
        setAuthtoken(token.authtoken)
      };

    return (
        <div>
            <div className="section">
                <div className="">
                    <div className="row full-height justify-content-center">
                        <div className="col-12 text-center align-self-center py-5">
                            <div className="section pb-5 pt-5 pt-sm-2 text-center">
                                <h6 className="mb-0 pb-3">
                                    <span>Log In </span>
                                    <span>Sign Up</span>
                                </h6>
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    id="reg-log"
                                    name="reg-log"
                                />
                                <label htmlFor="reg-log" />
                                <div className="card-3d-wrap mx-auto">
                                    <div className="card-3d-wrapper">
                                        <div className="card-front">
                                            <div className="center-wrap">
                                                <div className="section text-center">
                                                    <h4 className="mb-4 pb-3">Log In</h4>
                                                    <div className="form-group">
                                                        <input
                                                            type="email"
                                                            className="form-style"
                                                            placeholder="Email"
                                                            value={email}
                                                            onChange={(event) => setEmail(event.target.value)}
                                                        />
                                                        <i className="input-icon uil uil-at" />
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="password"
                                                            className="form-style"
                                                            placeholder="Password"
                                                            value={password}
                                                            onChange={(event) => setPassword(event.target.value)}
                                                        />
                                                        <i className="input-icon uil uil-lock-alt" />
                                                    </div>
                                                    <button className="btn mt-4" type='submit' onClick={handleSubmitLogin}>
                                                        Login
                                                    </button>
                                                    <p className="mb-0 mt-4 text-center">
                                                        <a href="/" className="link">
                                                            Forgot your password?
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-back">
                                            <div className="center-wrap">
                                                <div className="section text-center">
                                                    <h4 className="mb-3 pb-3">Sign Up</h4>
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-style"
                                                            placeholder="Full Name"
                                                            value={name}
                                                            onChange={(event) => setName(event.target.value)}
                                                        />
                                                        <i className="input-icon uil uil-user" />
                                                    </div>
                                                    <div className="form-group mt-2">
                                                    <select className="form-style" value={gender}
                                                        onChange={(event) => setGender(event.target.value)}>
                                                        <option selected>Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        
                                                    </select> 
                                                        <i className="input-icon uil uil-social-distancing" />
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="number"
                                                            className="form-style"
                                                            placeholder="Age"
                                                            min="13" max="100"
                                                            value={age}
                                                            onChange={(event) => setAge(event.target.value)}
                                                        />
                                                        <i className="input-icon uil uil-calender" />
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="email"
                                                            className="form-style"
                                                            placeholder="Email"
                                                            value={email}
                                                            onChange={(event) => setEmail(event.target.value)}
                                                        />
                                                        <i className="input-icon uil uil-at" />
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="password"
                                                            className="form-style"
                                                            placeholder="Password"
                                                            value={password}
                                                            onChange={(event) => setPassword(event.target.value)}
                                                        />
                                                        <i className="input-icon uil uil-lock-alt" />
                                                    </div>
                                                     <button className="btn mt-4" type='submit' onClick={handleSubmitRegister}>
                                                        Register
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login