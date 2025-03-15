import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackingService } from '../../api';
import './Admin.css';

const AdminTrackingPage = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const initialFormState = {
    productName: '',
    productDescription: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    expectedDeliveryDate: '',
    statusUpdateInterval: 'auto',
    senderName: '',
    senderEmail: '',
    shippingFee: '',
    taxFee: '',
    packageWeight: '',
    invoiceNo: ''
  };

  const autoFillDataSets = [
    {
      label: 'Electronics - Headphones',
      data: {
        productName: 'Wireless Noise-Canceling Headphones',
        productDescription: 'Premium over-ear headphones with active noise cancellation and 40-hour battery life',
        customerName: 'John Doe',
        customerEmail: 'johndoe@example.com',
        customerPhone: '+1 (555) 123-4567',
        customerAddress: '123 Main Street, Anytown, USA 12345',
        senderName: 'Tech Innovations Inc.',
        senderEmail: 'shipping@techinnovations.com',
        expectedDeliveryDate: '2024-03-20',
        statusUpdateInterval: 'auto',
        shippingFee: '15.99',
        taxFee: '5.50',
        packageWeight: '0.5',
        invoiceNo: 'INV-2024-0315-001'
      }
    },
    {
      label: 'Clothing - Winter Jacket',
      data: {
        productName: 'Men\'s Insulated Winter Jacket',
        productDescription: 'Waterproof winter jacket with thermal lining and multiple pockets',
        customerName: 'Jane Smith',
        customerEmail: 'janesmith@example.com',
        customerPhone: '+1 (888) 456-7890',
        customerAddress: '456 Oak Street, Winterville, USA 54321',
        senderName: 'Fashion Outfitters',
        senderEmail: 'orders@fashionoutfitters.com',
        expectedDeliveryDate: '2024-04-15',
        statusUpdateInterval: '3days',
        shippingFee: '12.50',
        taxFee: '4.75',
        packageWeight: '1.2',
        invoiceNo: 'INV-2024-0416-002'
      }
    }
  ];

  const [formData, setFormData] = useState(initialFormState);
  const [trackingResult, setTrackingResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [trackings, setTrackings] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('createTracking');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletedCount, setDeletedCount] = useState(0);
  const navigate = useNavigate();

  const fetchTrackings = async () => {
    try {
      console.log('Fetching trackings...');
      const response = await trackingService.getAllTrackings();
      console.log('Trackings response:', response);
      
      if (response.success) {
        // Check if data is an array directly or nested
        if (Array.isArray(response.data)) {
          console.log('Setting trackings from array:', response.data);
          setTrackings(response.data);
        } else if (response.data && Array.isArray(response.data.trackings)) {
          console.log('Setting trackings from nested property:', response.data.trackings);
          setTrackings(response.data.trackings);
        } else {
          console.log('Response data is not in expected format:', response.data);
          setTrackings([]);
        }
      } else {
        console.error('API returned unsuccessful response:', response);
        setTrackings([]);
      }
      
      // Update deleted count
      const deletedIds = trackingService.getDeletedTrackingIds();
      setDeletedCount(deletedIds.length);
    } catch (error) {
      console.error('Error fetching trackings:', error);
      setTrackings([]);
    }
  };

  useEffect(() => {
    fetchTrackings();
  }, []);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleAutoFill = (dataSet) => {
    setFormData(dataSet);
  };

  const createTrackingOrder = async () => {
    const errors = [];
    if (!formData.productName.trim()) {
      errors.push('Product Name is required');
    }
    if (formData.customerEmail && !validateEmail(formData.customerEmail)) {
      errors.push('Invalid email format');
    }
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    setLoading(true);
    setError(null);
    setTrackingResult(null);
    try {
      const customerInfo = {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        address: formData.customerAddress
      };
      const senderInfo = {
        name: formData.senderName,
        email: formData.senderEmail
      };
      const payload = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        customerInfo,
        expectedDeliveryDate: formData.expectedDeliveryDate
          ? new Date(formData.expectedDeliveryDate)
          : undefined,
        // Add these directly to the payload
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        shippingFee: formData.shippingFee,
        taxFee: formData.taxFee,
        packageWeight: formData.packageWeight,
        invoiceNo: formData.invoiceNo,
        additionalDetails: {
          statusUpdateInterval: formData.statusUpdateInterval
        }
      };
      const response = await trackingService.createTracking(payload);
      if (response.success) {
        setTrackingResult(response.data);
        resetForm();
        // Refresh tracking list if successful
        fetchTrackings();
      } else {
        setError(response.message || 'Failed to create tracking');
      }
    } catch (err) {
      console.error('Error creating tracking:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to create tracking order'
      );
    } finally {
      setLoading(false);
    }
  };

  const openShippingLabel = (trackingNumber) => {
    window.open(trackingService.getShippingLabel(trackingNumber), '_blank');
  };

  const handleLogout = () => {
    trackingService.logoutAdmin();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setChangePasswordError('Both current and new passwords are required');
      return;
    }
    
    setChangePasswordLoading(true);
    setChangePasswordError('');
    
    try {
      const response = await trackingService.changeAdminPassword(currentPassword, newPassword);
      if (response.success) {
        setCurrentPassword('');
        setNewPassword('');
        setChangePasswordError('');
        alert('Password changed successfully');
      } else {
        setChangePasswordError(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setChangePasswordError(error.response?.data?.message || 'An error occurred while changing the password');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // Modified to use local storage for frontend-only deletion
  const handleDeleteTracking = (trackingId) => {
    if (!window.confirm('Are you sure you want to remove this tracking from the list?')) {
      return;
    }
    
    setDeletingId(trackingId);
    setDeleteLoading(true);
    
    // Save the deleted ID to localStorage and update UI
    setTimeout(() => {
      trackingService.deleteTrackingLocally(trackingId);
      setTrackings(prevTrackings => prevTrackings.filter(tracking => tracking._id !== trackingId));
      setDeleteLoading(false);
      setDeletingId(null);
      setDeletedCount(prev => prev + 1);
    }, 600);
  };

  // Restore all deleted trackings
  const handleRestoreAll = () => {
    if (!window.confirm('Restore all deleted tracking items?')) {
      return;
    }
    
    trackingService.clearDeletedTrackings();
    setDeletedCount(0);
    fetchTrackings();
  };

  return (
    <div className="admin-tracking-container">
      <button
        onClick={toggleSidebar}
        className="mobile-sidebar-toggle"
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1001,
          padding: '10px',
          background: '#e53e3e',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'none', // Hide by default on desktop
        }}
      >
        ☰
      </button>
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>Admin Menu</h2>
        <ul>
          <li>
            <button onClick={toggleSidebar}>
              {isSidebarOpen ? 'Back ' : 'Menu'}
            </button>
          </li>
          {isSidebarOpen && (
            <>
              <li>
                <button onClick={() => setActiveSection('createTracking')}>Create Tracking</button>
              </li>
              <li>
                <button onClick={() => setActiveSection('changePassword')}>Change Password</button>
              </li>
              <li>
                <button onClick={() => {
                  setActiveSection('allTrackings');
                  fetchTrackings(); // Refresh trackings when this tab is clicked
                }}>All Trackings</button>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="admin-content">
        {activeSection === 'createTracking' && (
          <>
            <h1>Create Tracking Order</h1>
            <div className="tracking-form">
              <div className="form-section">
                <h2>Product Information</h2>
                <input
                  type="text"
                  name="productName"
                  placeholder="Product Name *"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="productDescription"
                  placeholder="Product Description"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-section">
                <h2>Sender Information</h2>
                <input
                  type="text"
                  name="senderName"
                  placeholder="Sender Name"
                  value={formData.senderName}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="senderEmail"
                  placeholder="Sender Email"
                  value={formData.senderEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-section">
                <h2>Customer Information</h2>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Customer Name"
                  value={formData.customerName}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="customerEmail"
                  placeholder="Customer Email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                />
                <input
                  type="tel"
                  name="customerPhone"
                  placeholder="Customer Phone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                />
                <textarea
                  name="customerAddress"
                  placeholder="Customer Address"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-section">
                <h2>Delivery Details</h2>
                <div className="input-group">
                  <label>Expected Delivery Date</label>
                  <input
                    type="date"
                    name="expectedDeliveryDate"
                    value={formData.expectedDeliveryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Status Update Interval</label>
                  <select
                    name="statusUpdateInterval"
                    value={formData.statusUpdateInterval}
                    onChange={handleInputChange}
                  >
                    <option value="auto">Automatic (30 sec)</option>
                    <option value="5hours">Every 5 Hours</option>
                    <option value="10hours">Every 10 Hours</option>
                    <option value="1day">Every 1 Day</option>
                    <option value="3days">Every 3 Days</option>
                    <option value="4days">Every 4 Days</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>
              <div className="form-section">
                <h2>Additional Details</h2>
                <input
                  type="text"
                  name="shippingFee"
                  placeholder="Shipping Fee"
                  value={formData.shippingFee}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="taxFee"
                  placeholder="Tax Fee"
                  value={formData.taxFee}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="packageWeight"
                  placeholder="Package Weight"
                  value={formData.packageWeight}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="invoiceNo"
                  placeholder="Invoice Number"
                  value={formData.invoiceNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group">
                <button
                  onClick={createTrackingOrder}
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? 'Creating...' : 'Create Tracking Order'}
                </button>
                <div className="dropdown">
                  <button className="dropdown-toggle quick-fill-button">
                    Auto Fill
                  </button>
                  <div className="dropdown-menu">
                    {autoFillDataSets.map((dataSet, index) => (
                      <button
                        key={index}
                        onClick={() => handleAutoFill(dataSet.data)}
                        className="dropdown-item"
                      >
                        {dataSet.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            {trackingResult && (
              <div className="tracking-result">
                <h2>Tracking Created Successfully</h2>
                <div className="result-details">
                  <p>
                    <strong>Tracking Number:</strong> {trackingResult.trackingNumber}
                  </p>
                  <p>
                    <strong>Product:</strong> {formData.productName}
                  </p>
                  <p>
                    <strong>Current Status:</strong> {trackingResult.currentStatus}
                  </p>
                  <button
                    onClick={() => openShippingLabel(trackingResult.trackingNumber)}
                    className="label-button"
                  >
                    View Shipping Label
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {activeSection === 'changePassword' && (
          <div className="change-password">
            <h2>Change Password</h2>
            <br />
            <form id='form' onSubmit={handleChangePassword}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={changePasswordLoading}
              />
           
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={changePasswordLoading}
              />
              <br />
              <div className="password-visibility">
                <input 
                  type="checkbox" 
                  id="showPassword" 
                  onChange={() => setIsPasswordVisible(!isPasswordVisible)}
                />
                <label htmlFor="showPassword">Show Password</label>
              </div>
              <button 
                type="submit" 
                disabled={changePasswordLoading}
                className={changePasswordLoading ? "loading-button" : ""}
              >
                {changePasswordLoading ? "Changing Password..." : "Change Password"}
              </button>
            </form>
            {changePasswordError && <p className="error-message">{changePasswordError}</p>}
          </div>
        )}
        {activeSection === 'allTrackings' && (
          <div className="all-trackings">
            <h2>All Trackings</h2>
            <div className="tracking-actions-header">
              <button 
                onClick={fetchTrackings} 
                className="refresh-button"
              >
                Refresh Trackings
              </button>
              
              {deletedCount > 0 && (
                <button 
                  onClick={handleRestoreAll}
                  className="restore-button"
                  style={{ 
                    marginLeft: '20px',
                    backgroundColor: 'transparent',
                    color: 'transparent',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    position: 'absolute'
                  }}
                >
                  Restore All ({deletedCount})
                </button>
              )}
            </div>
            
            {trackings.length === 0 ? (
              <p>No tracking records found.</p>
            ) : (
              <div className="tracking-list">
                {trackings.map((tracking) => (
                  <div key={tracking._id} className="tracking-item">
                    <div className="tracking-info">
                      <p><strong>Tracking Number:</strong> {tracking.trackingNumber}</p>
                      <p><strong>Product Name:</strong> {tracking.productName}</p>
                      <p><strong>Status:</strong> {tracking.currentStatus}</p>
                      {tracking.expectedDeliveryDate && (
                        <p><strong>Expected Delivery:</strong> {new Date(tracking.expectedDeliveryDate).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div className="tracking-actions">
                      <button 
                        onClick={() => openShippingLabel(tracking.trackingNumber)}
                        className="action-button label-button"
                      >
                        Label
                      </button>
                      <button 
                        onClick={() => handleDeleteTracking(tracking._id)}
                        className="action-button delete-button"
                        disabled={deleteLoading && deletingId === tracking._id}
                      >
                        {deleteLoading && deletingId === tracking._id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTrackingPage;