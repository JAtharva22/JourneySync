import React, { useState } from 'react'
import './UserProfile.css'


function UserProfile() {

  const [userinfo, setUserinfo] = useState({
    name: '',
    email: '',
    phone: '',
    isVerified: 'false' //'pending' , 'true'
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setSelectedFile(file); // Update the state with the selected file
  };

  const verificationSubmit = (e) => {
    setUserinfo({ ...userinfo, isVerified: 'pending' });
  }



  return (
    <>
      <div className="container  mx-10 my-5 p-5 proheader">
        <h2>
          {"{"}user{"}"}
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
          defaultValue="{userEmail}"
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
                defaultValue="(Name)"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="number">Phone</label>
              <input
                type="text"
                className="form-control"
                id="number"
                defaultValue="(Number)"
              />
            </div>
          </div>
          <div className="d-flex">
            <button type="submit" className="btn btn-primary submit">
              Update
            </button>
            <button type="discard" className="btn discard mx-2">
              Discard
            </button>
          </div>
        </form>
      </div>
      {/* ------------ */}
      {userinfo.isVerified === 'true' ? (
        <div className="container mx-10 container-user">
          <h3 className="verified">Your Account is Verified</h3>
        </div>
      ) : userinfo.isVerified === 'false' ? (
        <div className="container mx-10 container-user">
          <h3 id="h3verify">Verify Your Account</h3>
          <form onSubmit={verificationSubmit}>
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