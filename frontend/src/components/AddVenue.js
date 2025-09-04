import React, { useState } from "react";
import axios from "axios";
import styles from "./VenueForm.module.css"; // Import CSS module

const VenueForm = () => {
    const [venue, setVenue] = useState({
        venue_name: "",
        event_type: "Professional", // Default option
        state: "",
        district: "",
        city: "",
        pincode: "",
        capacity: "",
        cost_range: "",
        email: "",
        contact_number: ""
    });

    const handleChange = (e) => {
        setVenue({ ...venue, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/venues", venue);
            alert(response.data.message);
            setVenue({ 
                venue_name: "",
                event_type: "Professional", // Reset to default
                state: "",
                district: "",
                city: "",
                pincode: "",
                capacity: "",
                cost_range: "",
                email: "",
                contact_number: ""
            });
        } catch (error) {
            console.error(error);
            alert("Error registering venue");
        }
    };

    return (
        <div className={styles.container}>
            <h2>Venue Registration</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.column}>
                    <input type="text" name="venue_name" placeholder="Venue Name" value={venue.venue_name} onChange={handleChange} required />
                    <select name="event_type" value={venue.event_type} onChange={handleChange} required>
                        <option value="Professional">Professional</option>
                        <option value="Personal">Personal</option>
                        <option value="Both">Both</option>
                    </select>
                    <input type="text" name="state" placeholder="State" value={venue.state} onChange={handleChange} required />
                    <input type="text" name="district" placeholder="District" value={venue.district} onChange={handleChange} required />
                    <input type="text" name="city" placeholder="City" value={venue.city} onChange={handleChange} required />
                </div>

                <div className={styles.column}>
                    <input type="text" name="pincode" placeholder="Pincode" value={venue.pincode} onChange={handleChange} required />
                    <input type="number" name="capacity" placeholder="Capacity" value={venue.capacity} onChange={handleChange} required />
                    <input type="text" name="cost_range" placeholder="Cost Range" value={venue.cost_range} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={venue.email} onChange={handleChange} required />
                    <input type="text" name="contact_number" placeholder="Contact Number" value={venue.contact_number} onChange={handleChange} required />
                </div>

                {/* Centered Submit Button */}
                <div className={styles.buttonContainer}>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default VenueForm;
