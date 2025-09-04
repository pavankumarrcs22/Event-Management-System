const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();
const validator = require('validator');
const router = express.Router();
// Create express app
const app = express();

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const chatbotRoutes = require("./routes/chatbot");
const confirmEventRoute = require("./routes/confirmEvent");
app.use("/api", confirmEventRoute);

// Middleware
app.use(express.json());
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pavan@2004', // Update with your MySQL password
  database: 'userAuthDB',
});

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate Input
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send('Invalid email format');
    }

    // Check for Existing User
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error('Database query error:', err.message);
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert New User with Role
      db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role],
        (err) => {
          if (err) {
            console.error('Error saving user:', err.message);
            return res.status(500).json({ message: 'Error saving user to database' });
          }
          res.status(201).json({ message: 'User signed up successfully' });
        }
      );
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST route to add organiser details
app.post("/api/venues/:venueId/services", (req, res) => {
  const { venueId } = req.params;
  const { organiserName, contactNumber, email, services, costPerPerson } = req.body;

  // Save data to the database
  const query = `
    INSERT INTO organiser_services (venue_id, organiser_name, contact_number, email, services, cost_per_person)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [venueId, organiserName, contactNumber, email, services, costPerPerson], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Failed to save organiser details" });
    }

    // Generate PDF with organiser details
    const pdfPath = `./organiser_confirmation_${result.insertId}.pdf`;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(18).text("Organiser Service Confirmation", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Venue ID: ${venueId}`);
    doc.text(`Organiser Name: ${organiserName}`);
    doc.text(`Contact Number: ${contactNumber}`);
    doc.text(`Email: ${email}`);
    doc.text(`Services Provided: ${services}`);
    doc.text(`Cost per Person: ${costPerPerson}`);

    doc.end();

    // Send confirmation email with PDF
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation of Organiser Details Submission",
      text: `Dear ${organiserName},

Your service details have been successfully submitted for the venue. Please find the attached confirmation document.

Thank you for your submission!

Best regards,
Event Management Team`,
      attachments: [{
        filename: "OrganiserConfirmation.pdf",
        path: pdfPath,
      }],
    };

    transporter.sendMail(mailOptions, (emailError, info) => {
      if (emailError) {
        console.error("❌ Email Error:", emailError);
        return res.status(500).json({ message: "Organiser details saved, but email failed to send." });
      }
      console.log("✅ Email sent:", info.response);
      res.status(200).json({ message: "Service details saved successfully, and confirmation email sent with PDF!" });
    });
  });
});

// // POST route to add organiser details
// app.post('/api/venues/:venueId/organiser', (req, res) => {
//   const venueId = req.params.venueId;
//   const { organiser_name, contact_number, services_provided, cost_per_person } = req.body;

//   if (!organiser_name || !contact_number || !services_provided || !cost_per_person) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   const query = `
//     INSERT INTO OrganiserDetails (venue_id, organiser_name, contact_number, services_provided, cost_per_person)
//     VALUES (?, ?, ?, ?, ?) `
//     ;
//   const values = [venueId, organiser_name, contact_number, services_provided, cost_per_person];

//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error('Error inserting into database:', err.message);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     res.status(201).json({ message: 'Service details submitted successfully', id: result.insertId });
//   });
// });
// // POST route to add organiser details
// app.post("/api/venues/:venueId/services", (req, res) => {
//   const { venueId } = req.params;
//   const { organiserName, contactNumber, email, services, costPerPerson } = req.body;

//   // Save data to the database
//   const query = `
//     INSERT INTO organiser_services (venue_id, organiser_name, contact_number, email, services, cost_per_person)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;

//   db.query(query, [venueId, organiserName, contactNumber, email, services, costPerPerson], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: "Failed to save organiser details" });
//     }

//     // Send confirmation email to the organiser
//     const mailOptions = {
//       from: process.env.EMAIL_USER,  // Sender's email
//       to: email,  // Recipient's email (the organiser's email)
//       subject: "Confirmation of Organiser Details Submission",
//       text: `
//         Dear ${organiserName},

//         Your service details have been successfully submitted for the venue. Below are your details:
        
//         Venue ID: ${venueId}
//         Organiser Name: ${organiserName}
//         Contact Number: ${contactNumber}
//         Services Provided: ${services}
//         Cost per Person: ${costPerPerson}

//         Thank you for your submission!

//         Best regards,
//         Event Management Team
//       `,
//     };

//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("❌ Email Error:", error);
//         return res.status(500).json({ message: "Organiser details submitted, but email failed to send." });
//       }
//       console.log("✅ Email sent: " + info.response);
//       res.status(200).json({ message: "Service details saved successfully, and confirmation email sent!" });
//     });
//   });
// });

// Login Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Error querying database:', err.message);
      return res.status(500).send('Database error');
    }

    if (result.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    // Include the role in the JWT payload
    const token = jwt.sign(
      { id: user.id, role: user.role },
      'secretKey',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role, // Send role to the frontend
    });
  });
});


// Fetch All Venues Route
app.get('/api/venues', (req, res) => {
  const query = 'SELECT * FROM venues';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching venues:', err.message);
      return res.status(500).send('Database error');
    }
    res.status(200).json(results);
  });
});

// Delete Venue Route
app.delete('/api/venues/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM venues WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting venue:', err.message);
      return res.status(500).send('Database error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Venue not found');
    }

    res.status(200).send('Venue deleted successfully');
  });
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Database connected");
});

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
  }
});

// // API to register a venue
// app.post("/api/venues", (req, res) => {
//   const { 
//       venue_name, event_type, state, district, city, pincode,
//       capacity, cost_range, email, contact_number
//   } = req.body;

//   const sql = `INSERT INTO venues 
//   (venue_name, event_type, state, district, city, pincode, capacity, cost_range, email, contact_number) 
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   db.query(sql, 
//       [venue_name, event_type, state, district, city, pincode, parseInt(capacity, 10), cost_range, email, contact_number], 
//       (err, result) => {
//           if (err) {
//               console.error("❌ Database Error:", err);
//               return res.status(500).send({ message: "Database error" });
//           }

//           // Send Confirmation Email
//           const mailOptions = {
//               from: process.env.EMAIL_USER,
//               to: email,
//               subject: "Venue Registration Confirmation",
//               text: `Hello! Your venue '${venue_name}' for '${event_type}' in ${city}, ${state} has been registered successfully.`
//           };

//           transporter.sendMail(mailOptions, (error, info) => {
//               if (error) {
//                   console.error("❌ Email Error:", error);
//                   return res.status(500).send({ message: "Venue registered, but email failed to send." });
//               }
//               console.log("✅ Email sent: " + info.response);
//               res.status(201).send({ message: "Venue registered and confirmation email sent!" });
//           });
//       }
//   );
// });
// API to register a venue

app.post("/api/venues", (req, res) => {
  const {
    venue_name,
    event_type,
    state,
    district,
    city,
    pincode,
    capacity,
    cost_range,
    email,
    contact_number,
  } = req.body;

  const sql = `INSERT INTO venues 
  (venue_name, event_type, state, district, city, pincode, capacity, cost_range, email, contact_number) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      venue_name,
      event_type,
      state,
      district,
      city,
      pincode,
      parseInt(capacity, 10),
      cost_range,
      email,
      contact_number,
    ],
    (err, result) => {
      if (err) {
        console.error("\u274C Database Error:", err);
        return res.status(500).send({ message: "Database error" });
      }

      // Generate PDF Confirmation
      const pdfPath = `./venue_confirmation_${result.insertId}.pdf`;
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(pdfPath));

      doc.fontSize(18).text("Venue Registration Confirmation", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Venue Name: ${venue_name}`);
      doc.text(`Event Type: ${event_type}`);
      doc.text(`Location: ${city}, ${district}, ${state} - ${pincode}`);
      doc.text(`Capacity: ${capacity}`);
      doc.text(`Cost Range: ${cost_range}`);
      doc.text(`Contact: ${contact_number}`);

      doc.end();

      // Send Confirmation Email with PDF
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Venue Registration Confirmation",
        text: `Hello! Your venue '${venue_name}' for '${event_type}' in ${city}, ${state} has been registered successfully.`,
        attachments: [{ filename: "VenueConfirmation.pdf", path: pdfPath }],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("\u274C Email Error:", error);
          return res
            .status(500)
            .send({ message: "Venue registered, but email failed to send." });
        }
        console.log("\u2705 Email sent: " + info.response);
        res
          .status(201)
          .send({ message: "Venue registered and confirmation email sent!" });
      });
    }
  );
});

app.post("/api/venues/add-event", (req, res) => {
  const { eventName, eventLocation, venueId, eventDate } = req.body;

  const query = `
    INSERT INTO events (event_name, event_location, venue_id, event_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [eventName, eventLocation, venueId, eventDate], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add event" });
    }

    res.status(200).json({ message: "Event added successfully" });
  });
});
// Search venues by district or city
// Search venues by district and include organisers and services
app.get('/api/venues/search', (req, res) => {
  const { district } = req.query;

  // SQL query to get venues along with organiser details
  const query = `
    SELECT v.id, v.venue_name, v.city, v.capacity, v.rating, 
           o.organiser_name, o.contact_number
    FROM venues v
    LEFT JOIN OrganiserDetails o ON v.id = o.venue_id
    WHERE v.district = ?
    ORDER BY v.rating DESC
  `;

  db.query(query, [district], (err, results) => {
    if (err) {
      console.error('Error fetching venues:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});




// Get past events from the database
app.get('/api/events/past', (req, res) => {
  const currentDate = new Date(); // Get the current date

  // SQL query to fetch past events (events where the event date is less than today)
  const query = 'SELECT * FROM events WHERE event_date < ?';
  const query1=`SELECT events.*, 
       IFNULL(AVG(event_ratings.rating), 0) AS average_rating
FROM events
LEFT JOIN event_ratings ON events.id = event_ratings.event_id
WHERE events.event_date < CURDATE()
GROUP BY events.id;
`;
  db.query(query, [currentDate], (err, results) => {
    if (err) {
      console.error('Error fetching past events:', err.message);
      return res.status(500).send('Database error');
    }

    res.status(200).json(results); // Return the fetched events as a JSON response
  });
});
// Get upcoming or current events from the database
app.get('/api/events/upcoming', (req, res) => {
  const currentDate = new Date(); // Get the current date

  // SQL query to fetch upcoming or current events (events where the event date is today or in the future)
  const query = 'SELECT * FROM events WHERE event_date >= ?';

  db.query(query, [currentDate], (err, results) => {
    if (err) {
      console.error('Error fetching upcoming events:', err.message);
      return res.status(500).send('Database error');
    }

    res.status(200).json(results); // Return the fetched events as a JSON response
  });
});

app.post("/api/events/add", (req, res) => {
  const { venueId, eventName, eventDate, organiserName, organiserContact } = req.body;

  const query = `
    INSERT INTO events (venue_id, event_name, event_date, organiser_name, organiser_contact)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [venueId, eventName, eventDate, organiserName, organiserContact], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to confirm event" });
    }
    res.status(200).json({ message: "Event confirmed successfully!" });
  });
});
app.post("/api/feedback", (req, res) => {
  const { event_id, user_email, feedback_text, rating } = req.body;

  if (!event_id || !user_email || !feedback_text || !rating) {
      return res.status(400).json({ error: "All fields are required" });
  }

  const query = `INSERT INTO feedback (event_id, user_email, feedback_text, rating) VALUES (?, ?, ?, ?)`;
  
  db.query(query, [event_id, user_email, feedback_text, rating], (err, result) => {
      if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: "Failed to submit feedback" });
      }
      res.status(200).json({ message: "Feedback submitted successfully" });
  });
});
app.post("/api/events/rate", (req, res) => {
  const { eventId, rating } = req.body;

  if (!eventId || !rating) {
    return res.status(400).json({ error: "Event ID and rating are required" });
  }

  const insertQuery = `
    INSERT INTO event_ratings (event_id, rating)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE rating = VALUES(rating);
  `;

  db.query(insertQuery, [eventId, rating], (err, result) => {
    if (err) {
      console.error("Error inserting rating:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    // Fetch updated average rating
    const avgRatingQuery = `
      SELECT AVG(rating) AS updatedRating FROM event_ratings WHERE event_id = ?
    `;

    db.query(avgRatingQuery, [eventId], (err, avgResult) => {
      if (err) {
        console.error("Error fetching updated rating:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      const updatedRating = avgResult[0]?.updatedRating || 0;
      res.status(200).json({ message: "Rating updated successfully", updatedRating });
    });
  });
});

const createAdminAccount = async () => {
  try {
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123"; // Set a secure admin password

    // Check if admin already exists
    db.query("SELECT * FROM users WHERE email = ?", [adminEmail], async (err, result) => {
      if (err) {
        console.error("Error checking admin existence:", err.message);
        return;
      }

      // If admin does not exist, create one
      if (result.length === 0) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        db.query(
          "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
          ["admin", adminEmail, hashedPassword, "admin"],
          (err) => {
            if (err) {
              console.error("Error inserting admin user:", err.message);
            } else {
              console.log("✅ Admin account created successfully!");
            }
          }
        );
      } else {
        console.log("✅ Admin account already exists.");
      }
    });
  } catch (error) {
    console.error("Error creating admin account:", error.message);
  }
};

// Call this function when the server starts
createAdminAccount();

// Fetch venue by ID along with organizers
router.get("/", (req, res) => {
  const venueId = req.query.id;
  if (!venueId) return res.status(400).json({ error: "Venue ID is required" });

  const venueQuery = `
    SELECT id, venue_name, city, district, state, capacity, contact_number, cost_range, rating, email, event_type, pincode
    FROM venues
    WHERE id = ?;
  `;

  const organisersQuery = `
    SELECT id, organiser_name, contact_number, cost_per_person, services_provided
    FROM organiserdetails
    WHERE venue_id = ?;
  `;

  db.query(venueQuery, [venueId], (err, venueResults) => {
    if (err) {
      console.error("Error fetching venue:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    if (venueResults.length === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    db.query(organisersQuery, [venueId], (err, organiserResults) => {
      if (err) {
        console.error("Error fetching organisers:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        venue: venueResults[0],
        organisers: organiserResults,
      });
    });
  });
});

// Fetch venues by district with organizers
router.get("/search", (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).json({ error: "District is required" });
  }

  const query = `
    SELECT v.id AS venue_id, v.venue_name, v.rating,
           o.id AS organizer_id, o.organiser_name, o.services_provided
    FROM venues v
    LEFT JOIN OrganiserDetails o ON v.id = o.venue_id
    WHERE v.district = ?;
  `;

  db.query(query, [district], (err, results) => {
    if (err) {
      console.error("Error fetching venues:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Group venues with their organizers
    const venueMap = new Map();
    results.forEach((row) => {
      if (!venueMap.has(row.venue_id)) {
        venueMap.set(row.venue_id, {
          id: row.venue_id,
          venue_name: row.venue_name,
          rating: row.rating,
          organizers: [],
        });
      }

      if (row.organizer_id) {
        venueMap.get(row.venue_id).organizers.push({
          id: row.organizer_id,
          organiser_name: row.organiser_name,
          services_provided: row.services_provided,
        });
      }
    });

    res.json(Array.from(venueMap.values()));
  });
});

// Get venues by district with organizer details
router.get("/venues/search", (req, res) => {
  const { district } = req.query;

  const sql = `
    SELECT v.*, o.id AS organizer_id, o.organiser_name, o.contact_number, o.cost_per_person, o.services_provided
    FROM venues v
    LEFT JOIN organiser_services o ON v.id = o.venue_id
    WHERE v.district = ?;
  `;

  db.query(sql, [district], (err, results) => {
    if (err) {
      console.error("Error fetching venues:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No venues found" });
    }

    // Organize venue + organizers by venue_id
    const venueMap = {};

    results.forEach((row) => {
      if (!venueMap[row.id]) {
        venueMap[row.id] = {
          id: row.id,
          venue_name: row.venue_name,
          district: row.district,
          city: row.city,
          rating: row.rating,
          organizers: [],
        };
      }

      // Include organizers if present
      if (row.organizer_id) {
        venueMap[row.id].organizers.push({
          id: row.organizer_id,
          organiser_name: row.organiser_name,
          contact_number: row.contact_number,
          cost_per_person: row.cost_per_person,
          services_provided: row.services_provided,
        });
      }
    });

    res.json(Object.values(venueMap)); // Send array of venues with organizers
  });
});
// Confirm event and insert into events table
// app.post("/api/events/confirm", (req, res) => {
//   const { event_name, event_date, user_email, user_contact, venue_id, organiser_id } = req.body;

//   // Input Validation
//   if (!event_name || !event_date || !user_email || !venue_id) {
//     return res.status(400).json({ error: "Missing required fields." });
//   }

//   const sql = `
//     INSERT INTO events 
//     (event_name, event_date, user_email, user_contact, venue_id, organiser_id) 
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     sql,
//     [event_name, event_date, user_email, user_contact, venue_id, organiser_id || null],
//     (err, result) => {
//       if (err) {
//         console.error("❌ Database Error:", err);
//         return res.status(500).json({ error: "Database error while confirming event." });
//       }

//       console.log("✅ Event Confirmed. ID:", result.insertId);

//       // Fetch Venue and Organizer Details
//       const detailsQuery = `
//         SELECT v.venue_name, v.city, v.state, o.organiser_name, o.contact_number
//         FROM venues v
//         LEFT JOIN organiser_services o ON o.id = ?
//         WHERE v.id = ?;
//       `;

//       db.query(detailsQuery, [organiser_id, venue_id], (detailErr, details) => {
//         if (detailErr || details.length === 0) {
//           console.error("❌ Error fetching event details:", detailErr);
//           return res.status(500).json({ error: "Error retrieving event details." });
//         }

//         const { venue_name, city, state, organiser_name, contact_number } = details[0];

//         // Prepare Confirmation Email
//         const mailOptions = {
//           from: process.env.EMAIL_USER,
//           to: user_email,
//           subject: "🎉 Event Confirmation",
//           html: `
//             <h2>Event Confirmation</h2>
//             <p>Hello,</p>
//             <p>Your event <strong>'${event_name}'</strong> has been successfully confirmed!</p>
//             <p>📅 Event Date: ${new Date(event_date).toDateString()}</p>
//             <p>📍 Venue: ${venue_name}, ${city}, ${state}</p>
//             ${organiser_id
//               ? `<p>👤 Organizer: ${organiser_name} (📞 ${contact_number})</p>`
//               : `<p>Organizer: Not Assigned</p>`
//             }
//             <p>Thank you for choosing our platform!</p>
//           `,
//         };

//         // Send Confirmation Email
//         transporter.sendMail(mailOptions, (emailErr, info) => {
//           if (emailErr) {
//             console.error("❌ Email Error:", emailErr);
//             return res.status(500).json({ message: "Event confirmed, but email delivery failed." });
//           }

//           console.log("✅ Email sent successfully:", info.response);
//           res.status(201).json({
//             message: "Event confirmed and confirmation email sent!",
//             eventId: result.insertId,
//           });
//         });
//       });
//     }
//   );
// });


app.post("/api/events/confirm", (req, res) => {
  const { event_name, event_date, user_email, user_contact, venue_id, organiser_id } = req.body;

  // Step 1: Check if the venue is available on the requested date
  const checkAvailabilitySql = `
    SELECT * FROM events 
    WHERE venue_id = ? AND event_date = ?
  `;

  db.query(checkAvailabilitySql, [venue_id, event_date], (checkErr, results) => {
    if (checkErr) {
      console.error("❌ Error checking availability:", checkErr);
      return res.status(500).send({ message: "Database error while checking venue availability." });
    }
    
    if (results.length > 0) {
      console.log("❗ Venue already reserved:", results);
      return res.status(400).send({ message: "Venue is not available on the requested date." });
    }
    

    // Step 2: If available, insert the event
    const insertSql = `
      INSERT INTO events (event_name, event_date, user_email, user_contact, venue_id, organiser_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [event_name, event_date, user_email, user_contact, venue_id, organiser_id], (err, result) => {
      if (err) {
        console.error("❌ Error inserting event:", err);
        return res.status(500).send({ message: "Error creating event." });
      }

      // Step 3: Generate confirmation PDF
      const pdfPath = `./confirmation_${result.insertId}.pdf`;
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(pdfPath));

      doc.fontSize(18).text("Event Confirmation", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Event Name: ${event_name}`);
      doc.text(`Event Date: ${event_date}`);
      doc.text(`Venue ID: ${venue_id}`);
      doc.text(`Organiser ID: ${organiser_id || "Not specified"}`);
      doc.text(`Contact: ${user_email}, ${user_contact}`);

      doc.end();

      // Step 4: Send confirmation email with PDF
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user_email,
        subject: "Event Confirmation",
        text: `Hello, your event '${event_name}' on ${event_date} has been confirmed!`,
        attachments: [{ filename: "EventConfirmation.pdf", path: pdfPath }],
      };

      transporter.sendMail(mailOptions, (emailErr, info) => {
        if (emailErr) {
          console.error("❌ Email Error:", emailErr);
          return res.status(500).send({ message: "Event confirmed, but email failed to send." });
        }

        console.log("✅ Email sent:", info.response);
        res.status(201).send({ message: "Event confirmed successfully and email sent!" });
      });
    });
  });
});
// Node.js chatbot route (callback-based)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;

  const responseMap = {
    "hi": "Hello! How can I assist you today?",
    "help": "Sure! I can help you with event booking, venue availability, and more.",
    "bye": "Goodbye! Have a great day!"
  };

  const botResponse = responseMap[message.toLowerCase()] || "I'm not sure how to respond.";

  // Store user message in the database
  const sql = 'INSERT INTO chatbot_logs (user_message, bot_response) VALUES (?, ?)';
  db.query(sql, [message, botResponse], (err) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ response: "Error saving the conversation." });
    }
    res.status(200).json({ response: botResponse });
  });
});
app.get("/venue", (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Please provide a venue ID." });
  }

  const sql = "SELECT * FROM venues WHERE id = ?";
  const params = [id];

  console.log("Query:", sql, params); // Debugging

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      console.log("No venue found for ID:", id);
      return res.status(404).json({ message: "Venue not found!" });
    }
    res.json(result[0]); // Return venue details
  });
});
app.put("/venue/update/:id", (req, res) => {
  const { id } = req.params;
  const { venue_name, city, district, state, pincode, capacity, contact_number, email, event_type, cost_range, rating } = req.body;

  console.log("🔄 Updating Venue ID:", id);
  console.log("📝 Received Data:", req.body); // Log incoming data

  if (!venue_name || !city || !district || !state || !pincode || !capacity || !contact_number || !email || !event_type || !cost_range || !rating) {
      return res.status(400).json({ message: "All fields are required!" });
  }

  const sql = `
      UPDATE venues 
      SET venue_name = ?, city = ?, district = ?, state = ?, pincode = ?, 
          capacity = ?, contact_number = ?, email = ?, event_type = ?, 
          cost_range = ?, rating = ?
      WHERE id = ?
  `;

  db.query(sql, [venue_name, city, district, state, pincode, capacity, contact_number, email, event_type, cost_range, rating, id], (err, result) => {
      if (err) {
          console.error("❌ Database Update Error:", err);
          return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Venue not found or no changes made." });
      }

      res.json({ message: "✅ Venue updated successfully!" });
  });
});

module.exports = router;
app.use("/api/chat", chatbotRoutes);
// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

