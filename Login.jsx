// Import necessary dependencies from React
import React, { useState } from "react";

// Define the Login component, which receives props
function Login(props) {
  // Initialize state for credentials using useState hook
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });

  // Handle changes in input fields
  function handleChange(event) {
    // Destructure name and value from the event target
    const { name, value } = event.target;

    // Update the creds state, preserving previous state and updating the changed field
    setCreds((prevCreds) => {
      return {
        ...prevCreds,
        [name]: value,
      };
    });
  }

  // Handle form submission
  async function submitLogin(event) {
    // Prevent default form submission behavior
    event.preventDefault();
    try {
      // Call the onLogin function passed as a prop, with username and password
      await props.onLogin(creds.username, creds.password);
    } catch (error) {
      // Log any errors that occur during login
      console.error("Error during login:", error.message);
    }
  }

  // Render the login form
  return (
    <div>
      <h1>Welcome to Market Maven</h1>
      <form onSubmit={submitLogin}>
        {/* Username input field */}
        <input
          name="username"
          onChange={handleChange}
          value={creds.username}
          placeholder="Username"
        />
        {/* Password input field */}
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={creds.password}
          placeholder="Password"
        />
        {/* Submit button */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

// Export the Login component
export default Login;
