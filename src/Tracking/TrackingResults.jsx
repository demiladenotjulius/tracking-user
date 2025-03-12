import React, { useState, useEffect } from "react";
import { MapPin, ArrowRight, ChevronDown, AlertTriangle } from "lucide-react";
import "./TrackingRoute.css"; // Reusing the same CSS file
import { Link, useLocation, useNavigate } from "react-router-dom";
import { trackingService } from ".././../api";
import CustomAlert from "../CustomAlert/CustomAlert";
import StatusTracker from "../StatusTracker"; 

const TrackingResults = () => {
  const [trackingNumber, setTrackingNumber] = useState(
    "4962047838459066374262598570689"
  );
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters to get tracking number
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const trackingParam = queryParams.get("tracking");

    if (trackingParam) {
      setTrackingNumber(trackingParam);
      fetchTrackingData(trackingParam);
    }
  }, [location]);

  // Function to fetch tracking data
  const fetchTrackingData = async (trackingNum) => {
    setLoading(true);
    setError(null);

    console.log("Fetching tracking data for:", trackingNum);

    try {
      const result = await trackingService.getTracking(trackingNum);
      console.log("Complete API Response:", result);

      // Inspect tracking object structure in detail
      if (result && result.tracking) {
        console.log("Tracking object details:", {
          hasTrackingObject: !!result.tracking,
          trackingKeys: Object.keys(result.tracking),
          hasCurrentStatus: !!result.tracking.currentStatus,
          currentStatus: result.tracking.currentStatus,
          productName: result.tracking.productName,
          orderDate: result.tracking.orderDate,
          expectedDeliveryDate: result.tracking.expectedDeliveryDate,
        });
      }

      // Inspect statusUpdates object
      if (result && result.statusUpdates) {
        console.log("Status updates details:", {
          hasStatusUpdates: !!result.statusUpdates,
          updatesCount: result.statusUpdates.length,
          firstUpdate:
            result.statusUpdates.length > 0 ? result.statusUpdates[0] : null,
        });
      }

      // Check if the result itself has the expected structure
      if (result && result.tracking && result.statusUpdates) {
        // Result itself contains the data we need
        console.log("Setting trackingData to result directly");
        setTrackingData(result);
      } else if (
        result &&
        result.data &&
        result.data.tracking &&
        result.data.statusUpdates
      ) {
        // Result has a data property that contains what we need
        console.log("Setting trackingData to result.data");
        setTrackingData(result.data);
      } else {
        // No valid data structure found
        console.error("API response has unexpected structure:", result);
        setError("Unable to parse tracking data. Please try again later.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Tracking fetch error:", err);
      setLoading(false);
      if (err.response && err.response.status === 404) {
        setError(
          "We couldn't find tracking information for this number. Please check and try again."
        );
      } else {
        setError(
          "Currently, we are unable to provide tracking details. Please try again later."
        );
      }
    }
  };

  const handleSearch = () => {
    if (!trackingNumber.trim()) {
      setAlertMessage("Please enter a tracking number");
      setShowAlert(true);
      return;
    }

    // Update URL query parameter
    navigate(`/result?tracking=${trackingNumber}`);

    // Fetch tracking data
    fetchTrackingData(trackingNumber);
  };

  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <div className="tracking-container">
      {console.log("Current trackingData state:", trackingData)}

      {/* Custom Alert */}
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type="error"
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Link to="/">
              <MapPin className="icon" />
              <span className="logo-track">cargo</span>
              <span id="span1" className="logo-it">
                LANE
              </span>
            </Link>
          </div>
          <nav>
            <ul className="nav-list">
              <li>Features</li>
              <li>Service</li>
              <li>About</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section with Tracking Input */}
      <section className="hero tracking-hero">
        <div className="hero-container tracking-result-container">
          <div className="tracking-content">
            <h1 className="tracking-title">
              TRACK PACKAGE WITH TRACKING NUMBER
            </h1>
            <p className="tracking-subtitle">
              SUPPORT <span className="highlight-number">1,204</span> CARRIERS
              WORLDWIDE (FEDEX, UPS, DHL, USPS, AND MORE).
            </p>

            <div className="search-box tracking-search">
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
                id="btn2"
                className="search-button"
              >
                <ArrowRight className="icon-white" />
              </button>
            </div>

            <div className="tracking-result-box animate__animated animate__fadeIn animate__delay-600ms">
              {loading ? (
                <div className="tracking-loading">
                  <div className="loading-spinner"></div>
                  <p>Looking up your package...</p>
                </div>
              ) : error ? (
                <div className="tracking-error">
                  <AlertTriangle className="error-icon animate__animated animate__headShake animate__infinite animate__slower" />
                  <p className="error-message animate__animated animate__fadeIn animate__delay-800ms">
                    {error}
                  </p>
                </div>
              ) : trackingData ? (
                <div className="tracking-success">
                  <div className="tracking-header">
                    <h3>Tracking Information</h3>
                    {trackingData.tracking.currentStatus ? (
                      <div
                        className={`status-badge status-${trackingData.tracking.currentStatus
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                      >
                        {trackingData.tracking.currentStatus}
                      </div>
                    ) : (
                      <div className="status-badge status-unknown">
                        Status Not Available
                      </div>
                    )}
                  </div>

                  <div className="tracking-details">
                    <div className="detail-row">
                      <span className="detail-label">Product:</span>
                      <span className="detail-value">
                        {trackingData.tracking.productName}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Order Date:</span>
                      <span className="detail-value">
                        {new Date(
                          trackingData.tracking.orderDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    {trackingData.tracking.expectedDeliveryDate && (
                      <div className="detail-row">
                        <span className="detail-label">Expected Delivery:</span>
                        <span className="detail-value">
                          {new Date(
                            trackingData.tracking.expectedDeliveryDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add the StatusTracker component here */}
                  <StatusTracker />


                  {/* <div className="tracking-timeline">
                    <h4>Tracking History</h4>
                    {trackingData.statusUpdates.map((update, index) => (
                      <div
                        key={index}
                        className={`timeline-item status-${update.status
                          .toLowerCase()
                          .replace(/ /g, "-")} ${index === 0 ? "active" : ""}`}
                      >
                        <div className="timeline-item-content">
                          <div className="timeline-status">
                            <span className="status-dot">{index + 1}</span>
                            {update.status}
                          </div>
                          <div className="timeline-date">
                            {new Date(update.timestamp).toLocaleString()}
                          </div>
                          {update.notes && (
                            <div className="timeline-notes">{update.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div> */}

                  <div className="tracking-actions">
                    <a
                      href={trackingService.getShippingLabel(trackingNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-button"
                    >
                      View Shipping Label
                    </a>
                  </div>
                </div>
              ) : (
                <div className="tracking-error">
                  <AlertTriangle className="error-icon" />
                  <p className="error-message">
                    Enter a tracking number above to get detailed tracking
                    information.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <h2 className="section-title">FREQUENTLY ASKED QUESTIONS</h2>

          <div className="faq-content">
            {/* FAQ Item 1 */}
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(0)}>
                <span>What Is A Tracking Number?</span>
                <ChevronDown
                  className={`faq-icon ${expandedFaq === 0 ? "rotate" : ""}`}
                />
              </button>
              {expandedFaq === 0 && (
                <div className="faq-answer">
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
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(1)}>
                <span>How To Find Your Tracking Number?</span>
                <ChevronDown
                  className={`faq-icon ${expandedFaq === 1 ? "rotate" : ""}`}
                />
              </button>
              {expandedFaq === 1 && (
                <div className="faq-answer">
                  <p>
                    You can find your tracking number in the shipping
                    confirmation email from the retailer or shipping company.
                    It's also usually printed on your receipt or packing slip
                    that came with your order.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(2)}>
                <span>Why Can't My Package Be Found?</span>
                <ChevronDown
                  className={`faq-icon ${expandedFaq === 2 ? "rotate" : ""}`}
                />
              </button>
              {expandedFaq === 2 && (
                <div className="faq-answer">
                  <p>
                    Your package might not be found if it was recently shipped
                    and hasn't been scanned into the carrier's system yet. There
                    could also be a delay in updating the tracking information.
                    If the package was shipped more than 120 days ago, the
                    tracking information may no longer be available.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 4 */}
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(3)}>
                <span>How Long Does Tracking Information Stay Available?</span>
                <ChevronDown
                  className={`faq-icon ${expandedFaq === 3 ? "rotate" : ""}`}
                />
              </button>
              {expandedFaq === 3 && (
                <div className="faq-answer">
                  <p>
                    Most carriers retain tracking information for 120 days after
                    delivery. After this period, the tracking details may no
                    longer be accessible through our system. For older
                    shipments, you may need to contact the carrier or sender
                    directly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-columns">
            <div className="footer-column">
              <h3 className="footer-title">About CargoLANE</h3>
              <p className="footer-text">
                CargoLANE is an all-in-one package tracking tool for all your
                shipments. We will remember all of your tracking numbers and
                pull delivery status information from dozens of carriers with
                extra features not offered on the carriers' sites.
              </p>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Features</h3>
              <ul className="footer-links">
                <li>Multiple Carrier Support</li>
                <li>Real-time Updates</li>
                <li>Package History</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrackingResults;