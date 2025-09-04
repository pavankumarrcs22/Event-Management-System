// backend/routes/venueRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection

// Add service to a venue
// backend/routes/venueRoutes.js
router.post('/:id/services', (req, res) => {
    const { organiserName, contactNumber, services, costPerPerson, email } = req.body;
    const venueId = req.params.id;
  
    const query = `
      INSERT INTO organiser_services (venue_id, organiser_name, contact_number, email, services, cost_per_person)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    db.query(query, [venueId, organiserName, contactNumber, email, services, costPerPerson], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Error submitting service details");
      }
      res.status(200).json({ message: "Service details submitted successfully!" });
    });
  });
  
module.exports = router;
