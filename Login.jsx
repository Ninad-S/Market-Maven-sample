import React, { useState } from "react";

function Login(props) {
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setCreds((prevCreds) => {
      return {
        ...prevCreds,
        [name]: value,
      };
    });
  }

  async function submitLogin(event) {
    event.preventDefault();
    try {
      await props.onLogin(creds.username, creds.password);
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  }

  return (
    <div>
      <h1>Welcome to Market Maven</h1>
      <form onSubmit={submitLogin}>
        <input
          name="username"
          onChange={handleChange}
          value={creds.username}
          placeholder="Username"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={creds.password}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
