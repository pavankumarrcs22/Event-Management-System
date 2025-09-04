// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";  // Import useNavigate for redirecting
// import "../App.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();  // Initialize useNavigate

//   const handleLogin = async () => {
//     try {
//       // Remove 'response' if not needed
//       await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });
  
//       setSuccessMessage("Login Successful! Welcome back!");
//       setErrorMessage(""); // Clear any previous error message
  
//       setTimeout(() => {
//         navigate("/role-selection"); // Redirect to role selection after login
//       }, 1000);
//     } catch (error) {
//       setSuccessMessage(""); // Clear success message
//       if (error.response) {
//         setErrorMessage(error.response.data.message || "Invalid login credentials.");
//       } else if (error.request) {
//         setErrorMessage("Server is unreachable. Please check your connection.");
//       } else {
//         setErrorMessage("An error occurred: " + error.message);
//       }
//     }
//   };
  

//   return (
//     <div className="form-container">
//       <h2>Login</h2>
//       {successMessage && <div className="success-message">{successMessage}</div>}
//       {errorMessage && <div className="error-message">{errorMessage}</div>}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>
//       <p>
//         Don't have an account?{" "}
//         <a href="/signup">Sign up</a>
//       </p>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { role } = response.data; // Assuming the role is returned from the backend

      setSuccessMessage("Login Successful! Welcome back!");
      setErrorMessage("");

      // Redirect based on user role
      setTimeout(() => {
        switch (role) {
          case "user":
            navigate("/user-dashboard/:role");
            break;
          case "venueOwner":
            navigate("/venue");
            break;
          case "organizer":
            navigate("/organiser");
            break;
          case "admin":
            navigate("/role-selection");
            break;
          default:
            setErrorMessage("Unknown role. Contact support.");
            break;
        }
      }, 1000);
    } catch (error) {
      setSuccessMessage("");
      if (error.response) {
        setErrorMessage(error.response.data.message || "Invalid login credentials.");
      } else if (error.request) {
        setErrorMessage("Server is unreachable. Please check your connection.");
      } else {
        setErrorMessage("An error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account?{" "}
        <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
