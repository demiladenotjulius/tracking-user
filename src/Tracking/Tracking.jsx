import React, { useState, useEffect } from "react";
import { MapPin, ArrowRight, ChevronDown } from "lucide-react";
import "./TrackingRoute.css";
import img1 from "./deliveryman.png";
import img2 from "./closeupnew.jpeg";
import img3 from "./theman.jpeg";
import laser from "./laser.png";
import tnt from "./tnt.png";
import puro from "./puro.png";
import dyna from "./dyna.png";
import { Link, useNavigate } from "react-router-dom";
import CustomAlert from "../CustomAlert/CustomAlert"; 

const TrackingRoute = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [animateScroll, setAnimateScroll] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
  const [alertMessage, setAlertMessage] = useState(""); // Alert message content
  
  const navigate = useNavigate();
  
  // Function to handle search
  const handleSearch = () => {
    // Validate tracking number
    if (!trackingNumber.trim()) {
      // Show custom alert instead of browser alert
      setAlertMessage("Please enter a tracking number");
      setShowAlert(true);
      return;
    }
    
    // Navigate to results page with tracking number as parameter
    navigate(`/result?tracking=${trackingNumber}`);
  };
  
  // Set up scroll animation detection
  useEffect(() => {
    const handleScroll = () => {
      setAnimateScroll(true);
    };
    
    // Check for elements in viewport on initial load
    setTimeout(() => {
      setAnimateScroll(true);
    }, 100);
    
    // Add scroll listener
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };
  
  return (
    <div className="tracking-container">
      {/* Custom Alert */}
      {showAlert && (
        <CustomAlert 
          message={alertMessage} 
          type="error" 
          onClose={() => setShowAlert(false)} 
        />
      )}
      
      {/* Header */}
      <header className="header animate__animated animate__fadeIn">
        <div className="header-container">
          <div className="logo">
            <Link to="/">
              <MapPin className="icon animate__animated animate__bounceIn" />
              <span className="logo-track animate__animated animate__fadeInLeft animate__delay-200ms">
                cargo
              </span>
              <span id="span1"  className="logo-it animate__animated animate__fadeInRight animate__delay-200ms">
                LANE
              </span>
            </Link>
          </div>
          <nav>
            <ul className="nav-list">
              <li className="animate__animated animate__fadeInDown animate__delay-400ms">
                Features
              </li>
              <li className="animate__animated animate__fadeInDown animate__delay-600ms">
                Service
              </li>
              <li className="animate__animated animate__fadeInDown animate__delay-800ms">
                About
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title animate__animated animate__fadeInLeft">
              Explore our shipping and tracking services and streamline your
              supply chain today.
            </h1>
            <p className="hero-subtitle animate__animated animate__fadeInLeft animate__delay-200ms">
              SUPPORT 100+ CARRIERS WORLDWIDE (FEDEX, UPS, DHL, USPS, AND MORE).
            </p>
            
            <div className="search-box animate__animated animate__zoomIn animate__delay-400ms">
              <input
                type="text"
                placeholder="Enter Package Number"
                className="search-input"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <button
                onClick={handleSearch}
                type="button"
                id="btn1"
                className="search-button zoom-on-hover"
              >
                <ArrowRight className="icon-white" />
              </button>
            </div>
            <p className="help-text animate__animated animate__fadeIn animate__delay-600ms">
              <a href="#" className="help-link">
                Need help finding Package Number?
              </a>
            </p>
          </div>
          <div className="hero-image animate__animated animate__slideInFromRight animate__delay-400ms">
            <div className="imgcontain">
              <img src={img1} alt="Delivery man with package" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section 1 */}
      <section
        className="feature-section light scroll-animate"
        data-animation="fadeIn"
      >
        <div className="feature-container">
          <div className="feature-content">
            <h2
              className="feature-title scroll-animate"
              data-animation="fadeInUp"
            >
              Simplify Your Return Process
            </h2>
            <p
              className="feature-text scroll-animate"
              data-animation="fadeInUp"
            >
              Immerse yourself in the captivating world of tracking services.
              Our expert system will guide you through a dynamic and interactive
              tracking experience. From real-time updates to detailed info, our
              rich repository of features offer a comprehensive exploration of
              your shipments. With interactive tools, engaging content, and a
              supportive community, you'll develop fluency and understanding
              while forging lasting connections. Join us on this exciting
              journey and unlock the beauty and charm of tracking through
              technology.
            </p>
          </div>
          <div className="feature-image scroll-animate" data-animation="zoomIn">
            <img
              src={img2}
              alt="Happy couple receiving package"
              className="rounded-image"
            />
          </div>
        </div>
      </section>

      {/* Features Section 2 */}
      <section
        className="feature-section gray scroll-animate"
        data-animation="fadeIn"
      >
        <div className="feature-container reverse">
          <div className="feature-content">
            <h2
              className="feature-title scroll-animate"
              data-animation="fadeInUp"
            >
              World-Class Services You Can Count On
            </h2>
            <p
              className="feature-text scroll-animate"
              data-animation="fadeInUp"
            >
              Join our interactive tracking system for real-time updates and
              engagement with expert couriers. Monitor your package location and
              status, receive personalized feedback, and connect with a
              supportive community of delivery personnel. Experience yourself in
              a dynamic and interactive tracking experience from the comfort of
              your own home.
            </p>
          </div>
          <div className="feature-image scroll-animate" data-animation="zoomIn">
            <img
              src={img3}
              alt="Delivery man scanning package"
              className="rounded-image"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="pricing-section scroll-animate"
        data-animation="fadeIn"
      >
        <div className="pricing-container">
          <h2
            className="section-title scroll-animate"
            data-animation="fadeInUp"
          >
            Affordable, On-Time Delivery
          </h2>

          <div className="pricing-cards">
            {/* Pricing Card 1 */}
            <div
              className="pricing-card zoom-on-hover scroll-animate"
              data-animation="zoomIn"
            >
              <div className="card-content">
                <h3 className="card-title">Basic Package</h3>
                <p className="card-text">
                  Perfect for small businesses and occasional shippers. Track up
                  to 25 packages monthly
                </p>
                <p className="card-text">
                  Email notifications for delivery updates
                </p>
              </div>
              <div className="card-footer"></div>
            </div>

            {/* Pricing Card 2 */}
            <div
              className="pricing-card zoom-on-hover scroll-animate"
              data-animation="zoomIn"
            >
              <div className="card-content">
                <h3 className="card-title">Standard Package</h3>
                <p className="card-text second-pricing-card">
                  Ideal for growing businesses with regular shipments. Track
                  unlimited packages with priority support
                </p>
              </div>
              <div className="card-footer"></div>
            </div>

            {/* Pricing Card 3 */}
            <div
              className="pricing-card zoom-on-hover scroll-animate"
              data-animation="zoomIn"
            >
              <div className="card-content">
                <h3 className="card-title">Premium Package</h3>
                <p className="card-text">
                  Complete solution for high-volume shippers
                </p>
                <p className="card-text">
                  Advanced analytics and shipment reports
                </p>
                <p className="card-text">
                  API access and custom integration options
                </p>
              </div>
              <div className="card-footer"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Carriers Section */}
      <section
        className="carriers-section scroll-animate"
        data-animation="fadeIn"
      >
        <div className="carriers-container">
          <h2
            className="section-title scroll-animate"
            data-animation="fadeInUp"
          >
            Track All Your Shipments in Seconds
          </h2>
          <p
            className="section-subtitle scroll-animate"
            data-animation="fadeInUp"
          >
            OVER 20+ SUPPORTED CARRIERS
          </p>

          <div className="carrier-cards">
            {/* Carrier 1 */}
            <div
              className="carrier-card zoom-on-hover scroll-animate"
              data-animation="fadeInUp"
            >
              <img src={laser} alt="LASER SHIP" className="carrier-logo" />
              <h4 className="carrier-title">Laser Ship Express</h4>
              <p className="carrier-text">
                Fast regional delivery with real-time tracking
              </p>
              <p className="carrier-company">LaserShip Inc.</p>
            </div>

            {/* Carrier 2 */}
            <div
              className="carrier-card zoom-on-hover scroll-animate"
              data-animation="fadeInUp"
            >
              <img src={puro} alt="Purolator" className="carrier-logo" />
              <h4 className="carrier-title">Purolator Premium</h4>
              <p className="carrier-text">
                Reliable cross-border and international shipping
              </p>
              <p className="carrier-company">Purolator Courier Ltd</p>
            </div>

            {/* Carrier 3 */}
            <div
              className="carrier-card zoom-on-hover scroll-animate"
              data-animation="fadeInUp"
            >
              <img src={tnt} alt="TNT" className="carrier-logo" />
              <h4 className="carrier-title">TNT Global Express</h4>
              <p className="carrier-text">
                Worldwide delivery with customs clearance
              </p>
              <p className="carrier-company">TNT Express</p>
            </div>

            {/* Carrier 4 */}
            <div
              className="carrier-card zoom-on-hover scroll-animate"
              data-animation="fadeInUp"
            >
              <img src={dyna} alt="Dynamex" className="carrier-logo" />
              <h4 className="carrier-title">Dynamex Same-Day</h4>
              <p className="carrier-text">
                Urgent local delivery with route optimization
              </p>
              <p className="carrier-company">Dynamex Inc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section scroll-animate" data-animation="fadeIn">
        <div className="faq-container">
          <h2
            className="section-title scroll-animate"
            data-animation="fadeInUp"
          >
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="faq-content">
            {/* FAQ Item 1 */}
            <div className="faq-item scroll-animate" data-animation="fadeInUp">
              <button className="faq-question" onClick={() => toggleFaq(0)}>
                <span>What Is A Tracking Number ?</span>
                <ChevronDown
                  className={`faq-icon ${expandedFaq === 0 ? "rotate" : ""}`}
                />
              </button>
              {expandedFaq === 0 && (
                <div className="faq-answer animate__animated animate__fadeIn">
                  <p>
                    A tracking number is a unique code assigned to your package
                    that allows you to monitor its journey from the sender to
                    the destination. It typically contains a combination of
                    numbers and letters.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="faq-item scroll-animate" data-animation="fadeInUp">
              <button className="faq-question" onClick={() => toggleFaq(1)}>
                <span>How To Find Your Tracking Number ?</span>
                <ChevronDown
                  className={`faq-icon ${expandedFaq === 1 ? "rotate" : ""}`}
                />
              </button>
              {expandedFaq === 1 && (
                <div className="faq-answer animate__animated animate__fadeIn">
                  <p>
                    You can find your tracking number in the shipping
                    confirmation email from the retailer or shipping company.
                    It's also usually printed on your receipt or packing slip
                    that came with your order.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer animate__animated animate__fadeIn">
        <div className="footer-container">
          <div className="footer-columns">
            <div className="footer-column">
              <h3 className="footer-title">About CargoLANE</h3>
              <p className="footer-text">
                CargoLANE is an all-in-one package tracking tool for all your
                shipments. We will remember all of your tracking numbers and
                pull delivery status information from dozens of carrier with
                extra features not offered on the carriers' sites.
              </p>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Features</h3>
              <ul className="footer-links">
                <li>Features</li>
                <li>Services</li>
                <li>About</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrackingRoute;