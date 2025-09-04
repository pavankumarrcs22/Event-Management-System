import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const OrganiserPage = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");  // State for search term
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/api/venues")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch venues");
        }
        return res.json();
      })
      .then((data) => {
        setVenues(data);
        setFilteredVenues(data); // Initially show all venues
      })
      .catch((err) => console.error("Error fetching venues:", err.message));
  }, []);

  useEffect(() => {
    // Filter venues based on the search term (venue name, city, or state)
    setFilteredVenues(
      venues.filter((venue) =>
        venue.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.state.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, venues]);

  const handleAddService = (venueId) => {
    fetch(`http://localhost:5000/api/venues/${venueId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add service");
        alert("Service added successfully!");
        setServiceName("");
        setSelectedVenue(null);

        // Refresh venues to show updated services
        fetch("http://localhost:5000/api/venues")
          .then((res) => res.json())
          .then((data) => setVenues(data))
          .catch((err) => console.error("Error refreshing venues:", err.message));
      })
      .catch((err) => alert(err.message));
  };
/*
  const handleSubmit = () => {
  fetch(`http://localhost:5000/api/venues/${venueId}/organiser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      organiser_name,
      contact_number,
      services_provided,
      cost_per_person,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to submit service details');
      }
      return res.json();
    })
    .then((data) => {
      alert(data.message);
      // Reset form or navigate away if needed
    })
    .catch((err) => alert(err.message));
};
*/

  return (
    <div className="organiser-page">
      <h2>Organiser Page</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search venues by name, city, or state"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="venue-list">
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => (
            <div key={venue.id} className="venue-card">
              <h3>{venue.venue_name}</h3>
              <p>Location: {venue.city}, {venue.state}</p>
              <p>Capacity: {venue.capacity}</p>
              <p>Cost Range: {venue.cost_range}</p>
              <p>Services: {venue.services ? venue.services.split(',').join(', ') : "No services added yet"}</p>
              <button onClick={() => navigate(`/services/${venue.id}`)}>
              Add Service
            </button>
              {selectedVenue === venue.id && (
                <div className="add-service">
                  <input
                    type="text"
                    placeholder="Enter service name"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                  />
                  <button onClick={() => handleAddService(venue.id)}>
                    Submit
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No venues found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default OrganiserPage;
