import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const UserPage = () => {
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  const handleSubmit = async () => {
    if (!eventType || !eventDate || !eventTime || !eventLocation) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/events", {
        eventType,
        eventDate,
        eventTime,
        eventLocation,
      });
      console.log("Event Created", response.data);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event", error);
      alert("Failed to create event!");
    }
  };

  return (
    <div className="user-page">
      <h2>Plan Your Event</h2>
      <form>
        <label>Type of Event:</label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="">Select Event Type</option>
          <option value="Professional">Professional</option>
          <option value="Personal">Personal</option>
        </select>

        <label>Event Date:</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />

        <label>Event Time:</label>
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />

        <label>Event Location:</label>
        <input
          type="text"
          placeholder="Enter location"
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
        />

        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserPage;
