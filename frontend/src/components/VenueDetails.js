import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VenueDetails.css";

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenueDetails = () => {
      const xhr = new XMLHttpRequest();
      console.log(id);
      
      const url = `http://localhost:5000/api/venues?id=${id}`;
    
      xhr.open("GET", url, true);
    
      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            setVenue(data.venue);
            setOrganizers(data.organisers); // Ensure key matches backend response
          } catch (err) {
            console.error("Error parsing venue details:", err.message);
            alert("Error parsing venue details.");
            navigate("/"); // Redirect to home on error
          }
        } else {
          console.error("Failed to fetch venue details:", xhr.statusText);
          alert("Error fetching venue details.");
          navigate("/"); // Redirect on failure
        }
        setLoading(false);
      };
    
      xhr.onerror = () => {
        console.error("Request failed");
        alert("Error fetching venue details.");
        navigate("/"); // Redirect on error
        setLoading(false);
      };
    
      xhr.send();
    };
    

    fetchVenueDetails();
  }, [id, navigate]);

  if (loading) return <p>Loading venue details...</p>;
  if (!venue) return <p>Venue not found.</p>;

  return (
    <div className="venue-details">
      <h2>{venue.venue_name}</h2>
      <p>
        <strong>Rating:</strong> ⭐ {venue.rating || "No rating yet"}
      </p>
      <p>
        <strong>Location:</strong> {venue.city}, {venue.district}, {venue.state}
      </p>
      <p>
        <strong>Capacity:</strong> {venue.capacity || "N/A"}
      </p>
      <p>
        <strong>Contact:</strong> {venue.contact_number || "No contact info"}
      </p>
      <p>
        <strong>Event Type:</strong> {venue.event_type || "Not specified"}
      </p>
      <p>
        <strong>Cost Range:</strong> {venue.cost_range || "Not specified"}
      </p>

      <h3>Organizers at this Venue</h3>
      {organizers.length > 0 ? (
        <ul>
          {organizers.map((org) => (
            <li key={org.id}>
              <strong>{org.organiser_name}</strong> - {org.contact_number} | Cost: ₹{org.cost_per_person}
              <p>
                <strong>Services Provided:</strong> {org.services_provided}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No organizers found for this venue.</p>
      )}

      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default VenueDetails;
