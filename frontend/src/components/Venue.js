import React from "react";
import { useNavigate } from "react-router-dom";
import "./Venue.css"; // Ensure you have a CSS file for styling

const Venue = () => {
  const navigate = useNavigate();

  return (
    <div className="venue-container">
      <h1>Welcome to Venue Management</h1>
      <p>Manage your venues with ease!</p>

      <div className="venue-actions">
        <button
          onClick={() => navigate("/venue/add")}
          className="venue-btn"
          aria-label="Add Venue"
        >
          Add Venue
        </button>
        <button
          onClick={() => navigate("/venue/update")}
          className="venue-btn"
          aria-label="Update Venue"
        >
          Update Venue
        </button>
        <button
          onClick={() => navigate("/venue/delete")}
          className="venue-btn"
          aria-label="Delete Venue"
        >
          Delete Venue
        </button>
{/* 
        <button
          onClick={() => navigate("/logout")}
          className="logout-btn"
          aria-label="Logout"
        >
          Logout
        </button> */}
      </div>
    </div>
  );
};

export default Venue;
