import React, { useState, useEffect } from "react";
import "./PastEvents.css"; // Ensure your CSS file is linked
import { useNavigate } from "react-router-dom";

const PastEvents = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({}); // Store user ratings
  const [showThanks, setShowThanks] = useState(false); // State for showing thanks message
  const [ratedEvents, setRatedEvents] = useState(new Set()); // Track rated events
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    fetchPastEvents();
    loadRatedEvents();
  }, []);

  // Load rated events from localStorage
  const loadRatedEvents = () => {
    const storedRatings = JSON.parse(localStorage.getItem("ratedEvents")) || [];
    setRatedEvents(new Set(storedRatings));
  };

  // Save rated event to localStorage
  const saveRatedEvent = (eventId) => {
    const updatedRatedEvents = new Set(ratedEvents);
    updatedRatedEvents.add(eventId);
    setRatedEvents(updatedRatedEvents);
    localStorage.setItem("ratedEvents", JSON.stringify(Array.from(updatedRatedEvents)));
  };

  // Fetch past events from API
  const fetchPastEvents = () => {
    fetch("http://localhost:5000/api/events/past")
      .then((res) => res.json())
      .then((data) => {
        setPastEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching past events:", err.message);
        setLoading(false);
      });
  };

  // Handle rating submission
  const handleRatingSubmit = (eventId) => {
    if (ratedEvents.has(eventId)) {
      alert("You have already rated this event.");
      return;
    }

    const rating = ratings[eventId];
    if (!rating) {
      alert("Please select a rating before submitting.");
      return;
    }

    fetch("http://localhost:5000/api/events/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, rating }),
    })
      .then((res) => res.json())
      .then(() => {
        setShowThanks(true);
        saveRatedEvent(eventId);
        setTimeout(() => setShowThanks(false), 3000); // Hide message after 3 seconds
        fetchPastEvents(); // Refresh event list with updated ratings
      })
      .catch((err) => {
        console.error("Error submitting rating:", err.message);
        alert("Error submitting rating. Please try again.");
      });
  };

  return (
    <div className="past-events">
      <h2>Past Events</h2>
      {/* Back Button */}
      
      {showThanks && (
        <div className="thanks-message">
          <h3>Thanks for your rating!</h3>
        </div>
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="events-list">
          {pastEvents.length > 0 ? (
            <ul>
              {pastEvents.map((event) => (
                <li key={event.id}>
                  <p><strong>Event Name:</strong> {event.event_name}</p>
                  <p><strong>Date:</strong> {event.event_date}</p>

                  {/* Rating Section */}
                  <div className="rating-section">
                    {ratedEvents.has(event.id) ? (
                      <p><strong>Rating submitted:</strong> ✅</p>
                    ) : (
                      <>
                        <label><strong>Rate this event:</strong></label>
                        <select
                          value={ratings[event.id] || ""}
                          onChange={(e) =>
                            setRatings({ ...ratings, [event.id]: e.target.value })
                          }
                        >
                          <option value="">Select Rating</option>
                          <option value="1">⭐ 1</option>
                          <option value="2">⭐ 2</option>
                          <option value="3">⭐ 3</option>
                          <option value="4">⭐ 4</option>
                          <option value="5">⭐ 5</option>
                        </select>
                        <button onClick={() => handleRatingSubmit(event.id)}>
                          Submit
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No past events found.</p>
          )}
        </div>
      )}
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
    </div>
  );
};

export default PastEvents;
