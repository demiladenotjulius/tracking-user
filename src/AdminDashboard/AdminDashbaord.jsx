import React, { useState } from 'react';
import { trackingService } from '../../api';
import './Admin.css'

const AdminTrackingPage = () => {
  // Initial form state
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

  // Predefined auto-fill data sets
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

  // Form state
  const [formData, setFormData] = useState(initialFormState);
  
  // Tracking result state
  const [trackingResult, setTrackingResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form after successful submission
  const resetForm = () => {
    setFormData(initialFormState);
  };

  // Auto-fill form with predefined data
  const handleAutoFill = (dataSet) => {
    setFormData(dataSet);
  };

  // Create tracking order
  const createTrackingOrder = async () => {
    // Validation
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
        senderInfo,
        expectedDeliveryDate: formData.expectedDeliveryDate 
          ? new Date(formData.expectedDeliveryDate) 
          : undefined,
        additionalDetails: {
          statusUpdateInterval: formData.statusUpdateInterval,
          shippingFee: formData.shippingFee,
          taxFee: formData.taxFee,
          packageWeight: formData.packageWeight,
          invoiceNo: formData.invoiceNo
        }
      };

      const response = await trackingService.createTracking(payload);

      if (response.success) {
        setTrackingResult(response.data);
        resetForm(); // Reset form after successful creation
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

  // Open shipping label
  const openShippingLabel = (trackingNumber) => {
    window.open(trackingService.getShippingLabel(trackingNumber), '_blank');
  };

  return (
    <div className="admin-tracking-container">
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

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

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
    </div>
  );
};

export default AdminTrackingPage;