import React, { useEffect, useState } from "react";
import axios from "axios";

const VenueList = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/venues");
        setVenues(response.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/venues/${id}`);
      setVenues(venues.filter((venue) => venue.id !== id));
      alert("Venue deleted successfully");
    } catch (error) {
      console.error("Error deleting venue:", error);
    }
  };

  return (
    <div>
      <h2>Venue List</h2>
      <ul>
        {venues.map((venue) => (
          <li key={venue.id}>
            {venue.venue_name} ({venue.location}) - {venue.capacity} people, {venue.cost_range}
            <button onClick={() => handleDelete(venue.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VenueList;
