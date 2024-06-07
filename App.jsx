import React, { useState, useEffect } from "react";

import Login from "./Login";
import MarketMaven from "./MarketMaven";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ocimdzpalqvkaseuoyrj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jaW1kenBhbHF2a2FzZXVveXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxODM3MjIsImV4cCI6MjAzMjc1OTcyMn0.0CSciehOKHh4hlx9KnivMUr9MSAem-S_IIdqVBPbAcU";
const supabase = createClient(supabaseUrl, supabaseKey);
function App() {
  const [notes, setNotes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wasValid, setWasValid] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

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
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("Error fetching data");
    }
  };

  async function handleLogin(username, password) {
    try {
      await fetchUsers(username, password);
    } catch (error) {
      console.error("Error during login:", error);
      setWasValid(false);
      setError("Error during login");
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setError(null);
    localStorage.removeItem("user");
  }
  function handleBack() {
    setWasValid(true);
  }
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
