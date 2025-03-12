import axios from 'axios';

const API_URL = 'http://localhost:4500/api/v1';

export const trackingService = {
  loginAdmin: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password
      });
      if (response.data.success) {
        // Store token and admin info
        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.data.admin));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  createTracking: async (trackingData) => {
    try {
      const response = await axios.post(`${API_URL}/tracking/create`, trackingData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating tracking:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getTracking: async (trackingNumber) => {
    try {
      console.log("Making API request to:", `${API_URL}/tracking/track/${trackingNumber}`);
      const response = await axios.get(`${API_URL}/tracking/track/${trackingNumber}`);
      console.log("Complete raw API response:", response);
      
      if (response && response.data) {
        if (response.data.success && response.data.data) {
          return response.data.data;
        } else if (response.data.tracking && response.data.statusUpdates) {
          return response.data;
        } else {
          console.error("Unexpected API response structure:", response.data);
          throw new Error("API returned unexpected data structure");
        }
      } else {
        console.error("Empty API response");
        throw new Error("No data received from API");
      }
    } catch (error) {
      console.error("Tracking service error:", error);
      
      if (error.response) {
        console.error("Server error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
      
      throw error;
    }
  },

  getShippingLabel: (trackingNumber) => {
    return `${API_URL}/tracking/label/${trackingNumber}`;
  },

  getAllTrackings: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/tracking/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trackings:', error);
      throw error;
    }
  },

  updateTrackingStatus: async (trackingId, statusData) => {
    try {
      const response = await axios.put(`${API_URL}/tracking/${trackingId}/status`, statusData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating tracking status:', error);
      throw error;
    }
  }
};