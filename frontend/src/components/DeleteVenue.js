import React, { useState } from "react";
import "../App.css";

const DeleteVenue = () => {
  const [venueId, setVenueId] = useState("");

  const handleDeleteVenue = () => {
    // Perform API call to delete venue
    console.log(`Venue Deleted: ${venueId}`);
    alert("Venue deleted successfully!");
  };

  return (
    <div className="delete-venue">
      <h2>Delete Venue</h2>
      <input id="p2"
        type="text"
        placeholder="Venue ID"
        value={venueId}
        onChange={(e) => setVenueId(e.target.value)}
      />
      <button id="p1" onClick={handleDeleteVenue}>Delete Venue</button>
    </div>
  );
};

export default DeleteVenue;
