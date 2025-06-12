import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import Cookies from 'js-cookie';
import { Form, Button, Modal, Tab, Tabs, Alert, Image } from 'react-bootstrap';

function UserProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/getuserbyid', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': Cookies.get('authToken')
          },
        });
        
        if (response.ok) {
          const fetchedUserData = await response.json();
          setUserData(fetchedUserData);
          setFormData({
            name: fetchedUserData.name,
            age: fetchedUserData.age,
            phone: fetchedUserData.phone
          });
        }
      } catch (error) {
        console.error(error);
        showErrorAlert('Failed to fetch user data');
      }
    };
    fetchUserDetails();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const showSuccessAlert = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const showErrorAlert = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/updateuser", {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          phone: formData.phone,
        }),
        headers: {
          'Content-Type': 'application/json',
          'auth-token': Cookies.get('authToken')
        }
      });
      
      if (response.status === 200) {
        const updatedUser = await response.json();
        setUserData({
          ...userData,
          name: updatedUser.responseUser.name,
          age: updatedUser.responseUser.age,
        });
        showSuccessAlert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        showErrorAlert(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      showErrorAlert('Network error. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorAlert('New passwords do not match');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/updatepassword", {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
        headers: {
          'Content-Type': 'application/json',
          'auth-token': Cookies.get('authToken')
        }
      });
      
      if (response.ok) {
        showSuccessAlert('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const errorData = await response.json();
        showErrorAlert(errorData.error || 'Failed to update password');
      }
    } catch (error) {
      console.error(error);
      showErrorAlert('Network error. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/deleteuser", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': Cookies.get('authToken')
        }
      });
      
      if (response.ok) {
        // Clear cookies and redirect to login
        Cookies.remove('authToken');
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        showErrorAlert(errorData.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error(error);
      showErrorAlert('Network error. Please try again.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDiscard = () => {
    if (userData) {
      setFormData({
        name: userData.name,
        age: userData.age,
        phone: userData.phone
      });
    }
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const renderVerificationStatus = () => {
    if (userData?.isVerified === 'true') {
      return (
        <div className="alert alert-success mb-4">
          <i className="bi bi-check-circle-fill me-2"></i>
          Your account is verified
        </div>
      );
    } else if (userData?.isVerified === 'pending') {
      return (
        <div className="alert alert-warning mb-4">
          <i className="bi bi-clock-history me-2"></i>
          Verification pending. We'll notify you once completed.
        </div>
      );
    } else {
      return (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Verify Your Account</h5>
            <p className="card-text">
              Submit a government ID for verification (PDF, JPEG, PNG)
            </p>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control 
                type="file" 
                accept=".pdf, .jpeg, .jpg, .png"
                onChange={handleFileChange}
              />
            </Form.Group>
            {previewUrl && (
              <div className="mt-3">
                <Image src={previewUrl} alt="Preview" fluid className="mb-2" style={{ maxHeight: '200px' }} />
              </div>
            )}
            <Button variant="primary" disabled={!selectedFile}>
              Submit Verification
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">{userData?.name || 'User Profile'}</h2>
        </div>
        
        <div className="card-body">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="profile" title="Profile">
              <div className="mt-4">
                <h4 className="mb-4">Personal Information</h4>
                
                {showSuccess && (
                  <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                    {successMessage}
                  </Alert>
                )}
                
                {showError && (
                  <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                    {errorMessage}
                  </Alert>
                )}
                
                <Form onSubmit={handleProfileUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={userData?.email || ''} 
                      readOnly 
                      className="bg-light"
                    />
                    <Form.Text className="text-muted">
                      Your login email can't be changed
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="name"
                          value={formData.name} 
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Group>
                        <Form.Label>Age</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="age"
                          value={formData.age} 
                          onChange={handleInputChange}
                          min="18"
                          max="100"
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="phone"
                          value={formData.phone} 
                          onChange={handleInputChange}
                          min="1000000000"
                          max="9999999999"
                        />
                      </Form.Group>
                    </div>
                  </div>
                  
                  <div className="d-flex mt-3">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isUpdating}
                      className="me-2"
                    >
                      {isUpdating ? 'Updating...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleDiscard}
                      disabled={isUpdating}
                    >
                      Discard Changes
                    </Button>
                  </div>
                </Form>
              </div>
            </Tab>
            
            <Tab eventKey="security" title="Security">
              <div className="mt-4">
                <h4 className="mb-4">Security Settings</h4>
                
                {renderVerificationStatus()}
                
                <h5 className="mb-3">Change Password</h5>
                <Form onSubmit={handlePasswordUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="currentPassword"
                      value={passwordData.currentPassword} 
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Form.Group>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="newPassword"
                          value={passwordData.newPassword} 
                          onChange={handlePasswordChange}
                          minLength="6"
                          required
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Group>
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="confirmPassword"
                          value={passwordData.confirmPassword} 
                          onChange={handlePasswordChange}
                          minLength="6"
                          required
                        />
                      </Form.Group>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Change Password'}
                  </Button>
                </Form>
              </div>
            </Tab>
            
            <Tab eventKey="account" title="Account">
              <div className="mt-4">
                <h4 className="mb-4">Account Management</h4>
                
                <div className="card border-danger mb-4">
                  <div className="card-body">
                    <h5 className="card-title text-danger">Delete Account</h5>
                    <p className="card-text">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      
      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">
            <strong>Warning:</strong> This action is irreversible. All your data will be permanently deleted.
          </p>
          <p>Are you sure you want to delete your account?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete My Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserProfile;
