import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VenueDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/venue/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    const fetchVenues = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/venue/my-venues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVenues(response.data);
      } catch (error) {
        console.error("Error fetching venues", error);
      }
    };

    fetchUserProfile();
    fetchVenues();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Venue Dashboard</h2>

      {/* User Profile Section */}
      <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <h3>User Profile</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* New Venue Section */}
      <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <h3>Add New Venue</h3>
        <button onClick={() => navigate("/add-venue")}>+ Add Venue</button>
      </div>

      {/* Existing Venues Section */}
      <div style={{ border: "1px solid #ccc", padding: "15px" }}>
        <h3>Existing Venues</h3>
        {venues.length > 0 ? (
          <ul>
            {venues.map((venue) => (
              <li key={venue.id}>
                <strong>{venue.name}</strong> - {venue.location}
                <button onClick={() => navigate(`/venue/${venue.id}`)}>View</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No venues added yet.</p>
        )}
      </div>
    </div>
  );
};

export default VenueDashboard;
