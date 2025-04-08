import React from "react";
import { CheckCircle, Clock, Truck, MapPin, Package } from "lucide-react";
import "./StatusTracker.css";

const StatusTracker = () => {
  // Get the trackingData from the parent component using context
  // We'll use a simpler approach by accessing the parent's state directly
  
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'ordered':
      case 'order confirmed':
        return <CheckCircle size={20} />;
      case 'processing':
        return <Clock size={20} />;
      case 'ready to ship':
      case 'shipped':
        return <Truck size={20} />;
      case 'in transit':
      case 'out for delivery':
        return <MapPin size={20} />;
      case 'delivered':
        return <CheckCircle size={20} />;
      case 'cancelled':
        return <Clock size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  // Create a static mock timeline
  const statusStages = [
    { status: 'Order Confirmed', notes: 'Your order has been confirmed' },
    { status: 'Processing', notes: 'Your order is being processed' },
    { status: 'Shipped', notes: 'Your package has been shipped' },
    { status: 'Out for Delivery', notes: 'Your package is out for delivery' },
    { status: 'Delivered', notes: 'Your package has been delivered' }
  ];

  return (
    <div className="status-tracker">
      <h2>Tracking Status</h2>
      
      <div className="status-timeline">
        {statusStages.map((update, index) => (
          <React.Fragment key={index}>
            <div className={`status-step ${index <= 2 ? "active" : ""}`}>
              <div className="status-icon-content-wrapper">
                <div className="status-icon">{getStatusIcon(update.status)}</div>
                <div className="status-content">
                  <h3>{update.status}</h3>
                  {update.notes && <p>{update.notes}</p>}
                  <span className="status-date">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            {index < statusStages.length - 1 && (
              <div className="status-arrow"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatusTracker;