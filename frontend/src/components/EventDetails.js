import React, { useState, useEffect } from "react";

const EventDetails = ({ eventId }) => {
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => setEventDetails(data))
      .catch((err) => console.error("Error fetching event details:", err));
  }, [eventId]);

  if (!eventDetails) return <div>Loading...</div>;

  return (
    <div>
      <h2>{eventDetails.event_name}</h2>
      <p>Event Type: {eventDetails.event_type}</p>
      <p>Venue: {eventDetails.venue_name}</p>
      <p>Organizer: {eventDetails.organizer_name}</p>
      <p>Contact: {eventDetails.organizer_contact}</p>
    </div>
  );
};

export default EventDetails;
