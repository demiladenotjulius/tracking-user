import React from 'react';
import './CustomAlert.css';
import { AlertTriangle, X } from 'lucide-react';

const CustomAlert = ({ message, type = 'error', onClose }) => {
  return (
    <div className={`custom-alert-overlay animate__animated animate__fadeIn`}>
      <div className={`custom-alert custom-alert-${type} animate__animated animate__zoomIn`}>
        <button className="custom-alert-close" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="custom-alert-icon">
          <AlertTriangle size={28} />
        </div>
        <div className="custom-alert-content">
          <h3 className="custom-alert-title">
            {type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Notice'}
          </h3>
          <p className="custom-alert-message">{message}</p>
        </div>
        <div className="custom-alert-actions">
          <button 
            className="custom-alert-button" 
            onClick={onClose}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;