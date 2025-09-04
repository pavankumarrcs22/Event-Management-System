import React, { useState } from "react";
import "./NewEvent.css";

const NewEvent = () => {
  const [district, setDistrict] = useState("");
  const [venues, setVenues] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    user_email: "",
    user_contact: "",
    venue_id: null,
    organiser_id: null,
  });

  const availableDistricts = [
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Mumbai",
    "Delhi",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Surat",
  ];

  const handleDistrictChange = (e) => {
    const input = e.target.value;
    setDistrict(input);

    if (input) {
      const filtered = availableDistricts.filter((d) =>
        d.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectDistrict = (selected) => {
    setDistrict(selected);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/venues/search?district=${district}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched venues:", data);
        setVenues(data);
      })
      .catch((err) => {
        console.error("Error fetching venues:", err.message);
        alert("Error fetching venues. Please try again.");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmEvent = (venueId, organiserId = null) => {
    const eventDetails = { ...formData, venue_id: venueId, organiser_id: organiserId };

    fetch("http://localhost:5000/api/events/confirm", {  // ✅ Fixed the endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventDetails),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        alert("Event confirmed successfully!");
        console.log("Event created:", data);
      })
      .catch((err) => {
        console.error("Error creating event:", err.message);
        alert("Error creating event. Please try again.");
      });
  };

  return (
    <div className="new-event-form">
      <h2>Search Venues in a District</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>District</label>
          <input
            type="text"
            value={district}
            onChange={handleDistrictChange}
            placeholder="Enter district"
            required
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((d, index) => (
                <li key={index} onClick={() => selectDistrict(d)}>
                  {d}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Search Venues</button>
      </form>

      {venues.length > 0 && (
        <div className="venues-list">
          <h3>Available Venues in {district}</h3>
          <ul>
            {venues.map((venue) => (
              <li key={venue.id} className="venue-card">
                <h4>{venue.venue_name}</h4>
                <p>
                  <strong>Rating:</strong> ⭐ {venue.rating || "No rating yet"}
                </p>

                <h5>Organizers at this Venue:</h5>
                {venue.organizers && venue.organizers.length > 0 ? (
                  <ul>
                    {venue.organizers.map((org) => (
                      <li key={org.id}>
                        <strong>{org.organiser_name}</strong>
                        <p>
                          📞 {org.contact_number} | 💰 Cost: ₹{org.cost_per_person}
                        </p>
                        <p>🛠️ Services: {org.services_provided}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No organizers available for this venue.</p>
                )}

                {/* Event Input Form */}
                <div className="event-form">
                  <h5>Confirm Event</h5>
                  <input
                    type="text"
                    name="event_name"
                    placeholder="Event Name"
                    value={formData.event_name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="email"
                    name="user_email"
                    placeholder="Your Email"
                    value={formData.user_email}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="user_contact"
                    placeholder="Your Contact"
                    value={formData.user_contact}
                    onChange={handleInputChange}
                    required
                  />

                  {venue.organizers && venue.organizers.length > 0 ? (
                    venue.organizers.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => handleConfirmEvent(venue.id, org.id)}
                      >
                        Confirm with {org.organiser_name}
                      </button>
                    ))
                  ) : (
                    <button onClick={() => handleConfirmEvent(venue.id, null)}>
                      Confirm Event (No Organizer)
                    </button>
                  )}

                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewEvent;
