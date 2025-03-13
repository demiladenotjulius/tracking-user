// import axios from 'axios';

// const API_URL = 'http://localhost:4500/api/v1';

// export const trackingService = {
//   loginAdmin: async (email, password) => {
//     try {
//       const response = await axios.post(`${API_URL}/admin/login`, {
//         email,
//         password
//       });
//       if (response.data.success) {
//         // Store token and admin info
//         localStorage.setItem('adminToken', response.data.data.token);
//         localStorage.setItem('adminInfo', JSON.stringify(response.data.data.admin));
//       }
//       return response.data;
//     } catch (error) {
//       console.error('Login error:', error.response ? error.response.data : error.message);
//       throw error;
//     }
//   },

//   createTracking: async (trackingData) => {
//     try {
//       const response = await axios.post(`${API_URL}/tracking/create`, trackingData, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating tracking:', error.response ? error.response.data : error.message);
//       throw error;
//     }
//   },

//   getTracking: async (trackingNumber) => {
//     try {
//       console.log("Making API request to:", `${API_URL}/tracking/track/${trackingNumber}`);
//       const response = await axios.get(`${API_URL}/tracking/track/${trackingNumber}`);
//       console.log("Complete raw API response:", response);
      
//       if (response && response.data) {
//         if (response.data.success && response.data.data) {
//           return response.data.data;
//         } else if (response.data.tracking && response.data.statusUpdates) {
//           return response.data;
//         } else {
//           console.error("Unexpected API response structure:", response.data);
//           throw new Error("API returned unexpected data structure");
//         }
//       } else {
//         console.error("Empty API response");
//         throw new Error("No data received from API");
//       }
//     } catch (error) {
//       console.error("Tracking service error:", error);
      
//       if (error.response) {
//         console.error("Server error:", error.response.status, error.response.data);
//       } else if (error.request) {
//         console.error("No response received:", error.request);
//       }
      
//       throw error;
//     }
//   },

//   getShippingLabel: (trackingNumber) => {
//     return `${API_URL}/tracking/label/${trackingNumber}`;
//   },

//   getAllTrackings: async (page = 1, limit = 10) => {
//     try {
//       const response = await axios.get(`${API_URL}/tracking/all`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
//         },
//         params: { page, limit }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching trackings:', error);
//       throw error;
//     }
//   },

//   updateTrackingStatus: async (trackingId, statusData) => {
//     try {
//       const response = await axios.put(`${API_URL}/tracking/${trackingId}/status`, statusData, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error updating tracking status:', error);
//       throw error;
//     }
//   }
// };

import axios from 'axios';

// Define both URLs
const LOCAL_API_URL = 'http://localhost:4500/api/v1';
const PROD_API_URL = 'https://tracking-backend-o58s.onrender.com/api/v1';

// Choose API URL based on environment
const API_URL = import.meta.env.MODE === 'production' 
  ? PROD_API_URL 
  : LOCAL_API_URL;

// Create a local storage key for deleted tracking IDs
const DELETED_TRACKINGS_KEY = 'deletedTrackingIds';

// Helper to get deleted trackings from localStorage
const getDeletedTrackingIds = () => {
  const deletedIds = localStorage.getItem(DELETED_TRACKINGS_KEY);
  return deletedIds ? JSON.parse(deletedIds) : [];
};

// Helper to save deleted tracking IDs to localStorage
const saveDeletedTrackingId = (trackingId) => {
  const deletedIds = getDeletedTrackingIds();
  if (!deletedIds.includes(trackingId)) {
    deletedIds.push(trackingId);
    localStorage.setItem(DELETED_TRACKINGS_KEY, JSON.stringify(deletedIds));
  }
};

// Helper to remove a tracking ID from deleted list
const removeDeletedTrackingId = (trackingId) => {
  const deletedIds = getDeletedTrackingIds();
  const updatedIds = deletedIds.filter(id => id !== trackingId);
  localStorage.setItem(DELETED_TRACKINGS_KEY, JSON.stringify(updatedIds));
};

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
  }, 
  
  logoutAdmin: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    // Clear deleted tracking IDs on logout
    localStorage.removeItem(DELETED_TRACKINGS_KEY);
  },

  getAllTrackings: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/tracking/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        params: { page, limit }
      });
      
      if (response.data.success) {
        // Remove locally deleted trackings from the response
        const deletedIds = getDeletedTrackingIds();
        
        let trackingsData;
        if (Array.isArray(response.data.data)) {
          trackingsData = response.data.data.filter(tracking => !deletedIds.includes(tracking._id));
          response.data.data = trackingsData;
        } else if (response.data.data && Array.isArray(response.data.data.trackings)) {
          trackingsData = response.data.data.trackings.filter(tracking => !deletedIds.includes(tracking._id));
          response.data.data.trackings = trackingsData;
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching trackings:', error);
      throw error;
    }
  },

  changeAdminPassword: async (currentPassword, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/admin/change-password`, {
        currentPassword,
        newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
  
  // New method for frontend-only deletion
  deleteTrackingLocally: (trackingId) => {
    // Save to localStorage for persistence between page refreshes
    saveDeletedTrackingId(trackingId);
    return { success: true, message: 'Tracking deleted locally' };
  },
  
  // Method to restore a locally deleted tracking
  restoreDeletedTracking: (trackingId) => {
    removeDeletedTrackingId(trackingId);
    return { success: true, message: 'Tracking restored' };
  },
  
  // Clear all locally deleted trackings
  clearDeletedTrackings: () => {
    localStorage.removeItem(DELETED_TRACKINGS_KEY);
    return { success: true, message: 'All deleted trackings restored' };
  },
  
  // Get list of locally deleted tracking IDs
  getDeletedTrackingIds: getDeletedTrackingIds
};