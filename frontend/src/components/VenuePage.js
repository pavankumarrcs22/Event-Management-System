import React, { useState } from "react";
import "../App.css";

const VenuePage = () => {
  const [venueName, setVenueName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [costRange, setCostRange] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission or API call
    console.log("Venue Details Submitted:", {
      venueName,
      location,
      capacity,
      costRange,
    });

    // Reset the form
    setVenueName("");
    setLocation("");
    setCapacity("");
    setCostRange("");
    alert("Venue details submitted successfully!");
  };

  return (
    <div className="venue-page">
      <h2>Add Venue</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="venueName">Venue Name:</label>
          <input
            type="text"
            id="venueName"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            placeholder="Enter venue name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Capacity:</label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Enter capacity"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="costRange">Range of Cost:</label>
          <input
            type="text"
            id="costRange"
            value={costRange}
            onChange={(e) => setCostRange(e.target.value)}
            placeholder="Enter cost range (e.g., 500-1000)"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default VenuePage;
