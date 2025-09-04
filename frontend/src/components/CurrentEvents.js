import React, { useState, useEffect } from "react";
import "./UpcomingEvents.css"; // Add your CSS for styling
import { useNavigate } from "react-router-dom";

const UpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for API request
  const navigate = useNavigate();
  useEffect(() => {
    fetchUpcomingEvents(); // Fetch upcoming events when the component mounts
  }, []);

  // Function to fetch upcoming or current events
  const fetchUpcomingEvents = () => {
    fetch("http://localhost:5000/api/events/upcoming") // Make API call to fetch upcoming events
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched events:", data); // Log the data to check
        setUpcomingEvents(data); // Set fetched events to state
        setLoading(false); // Update loading state
      })
      .catch((err) => {
        console.error("Error fetching upcoming events:", err.message);
        setLoading(false); // Stop loading on error
      });
  };

  return (
    <div className="upcoming-events">
      <h2>Upcoming or Current Events</h2>

      {loading ? (
        <p>Loading events...</p> // Show loading text while fetching data
      ) : (
        <div className="events-list">
          {upcomingEvents.length > 0 ? (
            <ul>
              {upcomingEvents.map((event) => (
                <li key={event.id}>
                  <p><strong>Event Name:</strong> {event.event_name}</p>
                  <p><strong>Date:</strong> {event.event_date}</p>
                  <p><strong>Venue:</strong> {event.venue_name}</p>
                  <p><strong>Organizer:</strong> {event.organizer_name}</p>
                  <p><strong>Contact:</strong> {event.organizer_contact}</p>
                  <p><strong>Event Type:</strong> {event.event_type}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming events found.</p> // Display if no upcoming events found
          )}
        </div>
      )}
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
    </div>
  );
};

export default UpcomingEvents;
