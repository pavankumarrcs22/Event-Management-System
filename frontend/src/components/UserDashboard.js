import React from "react";
import { useParams, Link } from "react-router-dom";

const UserDashboard = () => {
  const { role } = useParams(); // Get role from URL

  // Check if role is undefined, if so, set a fallback value
  // const formattedRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "User";

  return (
    <div className="user-dashboard">
      {/* <h2>{formattedRole} Dashboard</h2>
      <p>Welcome to your dashboard. Here you can manage your events.</p> */}
      <h2>User Dashboard</h2>
      <div className="dashboard-options">
        <h3>Select an option:</h3>

        {/* Navigation links for Past, Current, and New events */}
        <div className="event-options">
          <Link to={`/user-dashboard/${role}/past`} className="event-btn">
            Past Events
          </Link>
          <Link to={`/user-dashboard/${role}/current`} className="event-btn">
            Current Events
          </Link>
          <Link to={`/user-dashboard/${role}/new`} className="event-btn">
            New Event
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
