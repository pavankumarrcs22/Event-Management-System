import React, { useState } from "react";
import axios from "axios";
import "./VenueUpdatePage.css"; 
const VenueUpdatePage = () => {
    const [venueId, setVenueId] = useState("");
    const [venueDetails, setVenueDetails] = useState(null);
    const [error, setError] = useState("");

    // Fetch venue details by ID
    const handleFetchVenue = async () => {
        setError("");
        if (!venueId) {
            setError("Please enter a venue ID.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/venue`, {
                params: { id: venueId },
            });

            setVenueDetails(response.data);
        } catch (err) {
            setError("Venue not found! Please enter a valid venue ID.");
            setVenueDetails(null);
        }
    };

    // Handle change in input fields
    const handleChange = (e) => {
        setVenueDetails({ ...venueDetails, [e.target.name]: e.target.value });
    };

    // Handle form submission for updating venue
    const handleUpdateVenue = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/venue/update/${venueDetails.id}`, venueDetails, {
                headers: { "Content-Type": "application/json" }, // ✅ Ensures JSON is properly sent
            });

            alert("Venue updated successfully!");
        } catch (err) {
            console.error("Error updating venue:", err.response?.data || err.message);
            alert("Error updating venue!");
        }
    };

    return (
        <div className="venue-update-container">
            <h2>Update Venue</h2>

            <input
                type="text"
                placeholder="Enter Venue ID"
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
            />
            <button onClick={handleFetchVenue}>Search</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {venueDetails && (
                <form onSubmit={handleUpdateVenue} className="venue-form">
                    <label>Venue Name:</label>
                    <input type="text" name="venue_name" value={venueDetails.venue_name} onChange={handleChange} />

                    <label>City:</label>
                    <input type="text" name="city" value={venueDetails.city} onChange={handleChange} />

                    <label>District:</label>
                    <input type="text" name="district" value={venueDetails.district} onChange={handleChange} />

                    <label>State:</label>
                    <input type="text" name="state" value={venueDetails.state} onChange={handleChange} />

                    <label>Pincode:</label>
                    <input type="text" name="pincode" value={venueDetails.pincode} onChange={handleChange} />

                    <label>Capacity:</label>
                    <input type="number" name="capacity" value={venueDetails.capacity} onChange={handleChange} />

                    <label>Contact Number:</label>
                    <input type="text" name="contact_number" value={venueDetails.contact_number} onChange={handleChange} />

                    <label>Email:</label>
                    <input type="email" name="email" value={venueDetails.email} onChange={handleChange} />

                    <label>Event Type:</label>
                    <input type="text" name="event_type" value={venueDetails.event_type} onChange={handleChange} />

                    <label>Cost Range:</label>
                    <input type="text" name="cost_range" value={venueDetails.cost_range} onChange={handleChange} />

                    <label>Rating:</label>
                    <input type="number" step="0.1" name="rating" value={venueDetails.rating} onChange={handleChange} />

                    <button type="submit">Update Venue</button>
                </form>
            )}
        </div>
    );
};

export default VenueUpdatePage;
