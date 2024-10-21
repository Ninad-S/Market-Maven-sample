// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import Login from "./Login";
import MarketMaven from "./MarketMaven";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://ocimdzpalqvkaseuoyrj.supabase.co";
const supabaseKey = "###";
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  // State variables
  const [notes, setNotes] = useState([]); // Unused state, consider removing
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wasValid, setWasValid] = useState(true);
  const [error, setError] = useState(null);

  // Check for stored user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch user data from Supabase
  const fetchUsers = async (username, password) => {
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("userName", username)
        .eq("password", password);
      
      if (data && data.length > 0) {
        setCurrentUser(data[0]);
        setIsLoggedIn(true);
        setWasValid(true);
        setError(null);
      } else {
        setIsLoggedIn(false);
        setWasValid(false);
      }
      
      if (error) throw error;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("Error fetching data");
    }
  };

  // Handle login process
  async function handleLogin(username, password) {
    try {
      await fetchUsers(username, password);
    } catch (error) {
      console.error("Error during login:", error);
      setWasValid(false);
      setError("Error during login");
    }
  }

  // Handle logout process
  function handleLogout() {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setError(null);
    localStorage.removeItem("user");
  }

  // Handle back button click
  function handleBack() {
    setWasValid(true);
  }

  // Render component
  return (
    <div>
      {error && <p>{error}</p>}
      {!wasValid ? (
        <>
          <p>Invalid Creds</p>
          <button onClick={handleBack}>Back</button>
        </>
      ) : !isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <button onClick={handleLogout}>LOGOUT</button>
          <MarketMaven />
        </>
      )}
    </div>
  );
}

export default App;
