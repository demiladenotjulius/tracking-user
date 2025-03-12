import React, { useState } from "react";
import { CheckCircle, Clock, Truck, MapPin } from "lucide-react";
import "./StatusTracker.css";

const StatusTracker = () => {
  const [status, setStatus] = useState("In Transit"); // Example status
  
  const statusData = [
    {
      id: 1,
      status: "Order Confirmed",
      icon: <CheckCircle size={20} />,
      description: "Your order has been confirmed.",
      date: "2023-10-01",
    },
    {
      id: 2,
      status: "Processing",
      icon: <Clock size={20} />,
      description: "Your order is being processed.",
      date: "2023-10-02",
    },
    {
      id: 3,
      status: "Shipped",
      icon: <Truck size={20} />,
      description: "Your order has been shipped.",
      date: "2023-10-03",
    },
    {
      id: 4,
      status: "In Transit",
      icon: <MapPin size={20} />,
      description: "Your order is on its way.",
      date: "2023-10-04",
    },
    {
      id: 5,
      status: "Delivered",
      icon: <CheckCircle size={20} />,
      description: "Your order has been delivered.",
      date: "2023-10-05",
    },
  ];
  
  return (
    <div className="status-tracker">
      <h2>Order Status</h2>
      <div className="status-timeline">
        {statusData.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`status-step ${step.status === status ? "active" : ""}`}>
              <div className="status-icon-content-wrapper">
                <div className="status-icon">{step.icon}</div>
                <div className="status-content">
                  <h3>{step.status}</h3>
                  <p>{step.description}</p>
                  <span className="status-date">{step.date}</span>
                </div>
              </div>
            </div>
            {index < statusData.length - 1 && (
              <div className="status-arrow"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatusTracker;