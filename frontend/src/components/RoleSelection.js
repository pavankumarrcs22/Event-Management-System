import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./rs.css";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [showVenueOptions, setShowVenueOptions] = useState(false);

  // Handles when the Venue button is clicked
  const handleVenueClick = () => {
    setShowVenueOptions(true);
  };

  // Handles when the Back button is clicked
  const handleBackClick = () => {
    setShowVenueOptions(false);
  };

  return (
    <div className="role-selection">
      <h2>Select operations</h2>

      {/* Role buttons - Display only when Venue options aren't shown */}
      {!showVenueOptions ? (
        <div className="role-buttons">
          <button
            onClick={handleVenueClick}
            className="role-btn"
            aria-label="Select Venue Role"
          >
            Venue Management
          </button>
          <button
            onClick={() => navigate("/organiser")}
            className="role-btn"
            aria-label="Select Organizer Role"
          >
            Organizer
          </button>
          <button
            onClick={() => navigate("/user-dashboard/:role")}
            className="role-btn"
            aria-label="Select User Role"
          >
            User
          </button>
        </div>
      ) : (
        // Venue Options buttons - Display when Venue role is selected
        <div className="venue-options">
          <h3>Manage Venues</h3>
          <button
            onClick={() => navigate("/venue/add")}
            className="venue-btn"
            aria-label="Add Venue"
          >
            Add Venue
          </button>
          <button
            onClick={() => navigate("/venue/delete")}
            className="venue-btn"
            aria-label="Delete Venue"
          >
            Delete Venue
          </button>
          <button
            onClick={handleBackClick}
            className="back-btn"
            aria-label="Back to Role Selection"
          >
            Back to Roles
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;
