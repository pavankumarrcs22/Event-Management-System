import React from "react";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { role } = useParams(); // Get the selected role from the URL

  return (
    <div>
      <h2>Welcome to the {role} Dashboard</h2>
      <p>Content specific to {role} users will go here.</p>
    </div>
  );
};

export default Dashboard;
