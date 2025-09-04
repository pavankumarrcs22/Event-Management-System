const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// MySQL Connection (Ensure compatibility with callbacks)
const db = mysql.createConnection({
  host: "localhost",
  user: "your_db_user",
  password: "your_db_password",
  database: "your_db_name",
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
    return;
  }
  console.log("✅ Connected to MySQL");
});

// Chatbot Route
router.post("/", (req, res) => {
  const { message } = req.body;

  // Simple chatbot logic to handle event-related questions
  if (message.toLowerCase().includes("venue")) {
    db.query("SELECT venue_name FROM venues", (err, results) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ response: "Database error occurred." });
      }

      const venueList = results.map((venue) => venue.venue_name).join(", ");
      return res.json({ response: `Available venues: ${venueList}` });
    });
  } else {
    return res.json({ response: "I can assist with venues and events. Try asking about 'venues'." });
  }
});

module.exports = router;
