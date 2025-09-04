import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ServiceDetailsPage = () => {
  const { venueId } = useParams(); // Get venueId from URL
  const navigate = useNavigate();

  // State to track selected service and user details
  const [organiserName, setOrganiserName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedService, setSelectedService] = useState(""); // Track selected service
  const [costPerPerson, setCostPerPerson] = useState("");
  const [submittedServiceDetails, setSubmittedServiceDetails] = useState(null); // Store submitted service details

  // List of available services
  const availableServices = [
    "Catering",
    "Decoration",
    "Photography",
    "Security",
    "Transportation",
    "DJ",
    "Event Planning"
  ];

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value); // Update the selected service
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const organiserData = {
      organiserName,
      contactNumber,
      email,
      services: selectedService, // Send only the selected service
      costPerPerson,
    };

    fetch(`http://localhost:5000/api/venues/${venueId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(organiserData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Service details saved successfully") {
          // Store the submitted service details in the state
          setSubmittedServiceDetails(data.organiserDetails);
          alert("Service details submitted successfully!");
          navigate("/"); // Navigate back to OrganiserPage after submission (optional)
        } else {
          alert("Service details submitted successfully!");
          navigate("/");
        }
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="service-details-page">
      <h2>Provide Organiser Details for Venue {venueId}</h2>
      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
          <label>Organiser Name</label>
          <input
            type="text"
            value={organiserName}
            onChange={(e) => setOrganiserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Services Provided</label>
          <select value={selectedService} onChange={handleServiceChange} required>
            <option value="">Select a Service</option>
            {availableServices.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Cost per Person</label>
          <input
            type="number"
            value={costPerPerson}
            onChange={(e) => setCostPerPerson(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {/* Display the submitted service details */}
      {submittedServiceDetails && (
        <div className="submitted-details">
          <h3>Submitted Service Details</h3>
          <p><strong>Organiser Name:</strong> {submittedServiceDetails.organiserName}</p>
          <p><strong>Contact Number:</strong> {submittedServiceDetails.contactNumber}</p>
          <p><strong>Email:</strong> {submittedServiceDetails.email}</p>
          <p><strong>Selected Service:</strong> {submittedServiceDetails.services}</p>
          <p><strong>Cost per Person:</strong> {submittedServiceDetails.costPerPerson}</p>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailsPage;
