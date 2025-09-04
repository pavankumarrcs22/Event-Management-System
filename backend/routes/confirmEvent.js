const express = require("express");
const router = express.Router();
const db = require("../db");

// Confirm Event - Save event details
router.post("/confirm-event", async (req, res) => {
  try {
    const {
      event_name,
      event_date,
      organiser_id,
      organiser_name,
      organiser_contact,
      user_contact,
      user_email,
      venue_id,
    } = req.body;

    // Validate required fields
    if (
      !event_name ||
      !event_date ||
      !organiser_id ||
      !organiser_name ||
      !organiser_contact ||
      !user_contact ||
      !user_email ||
      !venue_id
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert data into the 'event' table
    const insertQuery = `
      INSERT INTO event 
      (event_name, event_date, organiser_id, organiser_name, organiser_contact, user_contact, user_email, venue_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      event_name,
      event_date,
      organiser_id,
      organiser_name,
      organiser_contact,
      user_contact,
      user_email,
      venue_id,
    ];

    const [result] = await db.query(insertQuery, values);

    res.status(201).json({
      message: "Event confirmed successfully",
      event_id: result.insertId,
    });
  } catch (err) {
    console.error("Error confirming event:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
