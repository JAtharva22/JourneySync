import React, { useState, useEffect } from 'react'
import './UserProfile.css'
import Cookies from 'js-cookie';


function UserProfile() {

    const [userinfo, setUserinfo] = useState({
        name: '',
        email: '',
        age: '',
        isVerified: 'false' //'pending' , 'true'
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [userData, setUserData] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        setSelectedFile(file); // Update the state with the selected file
    };

    const verificationSubmit = (e) => {
        setUserinfo({ ...userinfo, isVerified: 'pending' });
    }

    const handleDiscard = (e) => {
        e.preventDefault();
        if (userData) {
            setUserinfo({
                name: userData.name,
                email: userData.email,
                age: userData.age,
            });
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/getuserbyid', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': Cookies.get('authToken')
                    },
                });
                if (response.ok) {
                    const fetchedUserData = await response.json();
                    setUserData(fetchedUserData);
                    setUserinfo({
                        name: fetchedUserData.responseUser.name,
                        email: fetchedUserData.responseUser.email,
                        age: fetchedUserData.recsponseUser.age,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserDetails();
    }, []);

    const updateUserInformation = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/updateuser", {
                method: 'PUT',
                body: JSON.stringify({
                    name: userinfo.name,
                    age: userinfo.age,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': Cookies.get('authToken')
                }
            })
            if (response.status === 200) {
                (function showSuccess() {
                    setShowSuccessMessage(true);
                    setTimeout(() => {
                        setShowSuccessMessage(false);
                    }, 5000);
                })();
                setUserData({
                    ...userData,
                    name: userinfo.name,
                    email: userinfo.email,
                })
            }
        } catch (error) {
            console.error(error);
            // Handle errors, e.g., display an error message
        }
    };




    return (
        <>
            <div className="container  mx-10 my-5 p-5 proheader">
                <h2>
                    {userinfo.name}
                </h2>
            </div>
            <div className="container mx-10 my-5 py-10 container-user">
                <h3>Update Your Personal Information</h3>
                <label htmlFor="name" className="emailspace">
                    Login email
                </label>
                <input
                    type="text"
                    readOnly=""
                    className="form-control-plaintext readonlyemail"
                    id="staticEmail"
                    defaultValue={userinfo.email}
                />
                <p className="emailcantchange">Your Login email can't be changed</p>
                <form>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={userinfo.name} // Use "value" to display user data
                                onChange={(e) => setUserinfo({ ...userinfo, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="number">Age</label>
                            <input
                                type="text"
                                className="form-control"
                                id="number"
                                value={userinfo.age} // Use "value" to display user data
                                onChange={(e) => setUserinfo({ ...userinfo, age: e.target.value })}
                            />
                        </div>
                    </div>
                    {/* Success message div */}
                    {showSuccessMessage && (
                        <>
                            <br />
                            <div className="alert alert-success">Your information has been updated.</div>
                        </>
                    )}
                    <div className="d-flex">
                        <button type="button" className="btn btn-primary submit" onClick={updateUserInformation}>
                            Update
                        </button>
                        <button type="discard" className="btn discard mx-2" onClick={handleDiscard}>
                            Discard
                        </button>
                    </div>
                </form>
            </div>
            {/* ------------ */}
            {userinfo.isVerified === 'false' ? (
                <div className="container mx-10 container-user">
                    <h3 className="verified">Your Account is Verified</h3>
                </div>
            ) : userinfo.isVerified === 'false' ? (
                <div className="container mx-10 container-user">
                    <h3 id="h3verify">Verify Your Account</h3>
                    <form >
                        <div className="form-group">
                            <label htmlFor="exampleFormControlFile1">
                                Submit aadhar for verification (PDF, JPEG, PNG)
                            </label>
                            <input
                                type="file"
                                className="form-control-file"
                                id="exampleFormControlFile1"
                                accept=".pdf, .jpeg, .jpg, .png"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary submit">
                            Verify
                        </button>
                    </form>
                </div>
            ) : (
                <div className="container mx-10 pendingverification container-user">
                    <h3 >Verification pending</h3>
                    <br />
                    <h3 >Please Be Patient</h3>
                </div>
            )}
        </>
    )
}

export default UserProfile