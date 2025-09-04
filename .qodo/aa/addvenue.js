import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const AddVenue = () => {
  const [venueName, setVenueName] = useState("");
  const [eventType, setEventType] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [capacity, setCapacity] = useState("");
  const [costRange, setCostRange] = useState("");
  const [email, setEmail] = useState(""); // State for email
  const [contactNumber, setContactNumber] = useState(""); // State for contact number

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/venues/add", {
        venue_name: venueName,
        event_type: eventType,
        state,
        district,
        city,
        pincode,
        capacity: parseInt(capacity, 10),
        cost_range: costRange,
        email, // Include email
        contact_number: contactNumber, // Include contact number
      });

      if (response.status === 201) {
        setVenueName("");
        setEventType("");
        setState("");
        setDistrict("");
        setCity("");
        setPincode("");
        setCapacity("");
        setCostRange("");
        setEmail(""); // Clear email field
        setContactNumber(""); // Clear contact number field

        alert("Venue added successfully!");
      } else {
        alert("Failed to add venue. Please try again.");
      }
    } catch (error) {
      console.error("Error adding venue:", error);
      alert("An error occurred while adding the venue. Please try again.");
    }
  };

  return (
    <div className="add-venue">
      <h2>Add Venue</h2>
      <form onSubmit={handleSubmit} className="form-container1">
        <div className="column">
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
            <label htmlFor="eventType">Type of Event:</label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              required
            >
              <option value="">Select Event Type</option>
              <option value="Professional">Professional</option>
              <option value="Personal">Personal</option>
              <option value="Both">Both</option>
            </select>
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
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Enter state"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="district">District:</label>
            <input
              type="text"
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Enter district"
              required
            />
          </div>
        </div>

        <div className="column">
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pincode">Pincode:</label>
            <input
              type="text"
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter pincode"
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

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number:</label>
            <input
              type="tel"
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="(000) 000-0000"
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Add Venue
        </button>
      </form>
    </div>
  );
};

export default AddVenue;
