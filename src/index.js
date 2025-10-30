import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Login from "./components/Login";
import "./index.css";

function Root() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("coloc_user");
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = (name) => setUser(name);
  const handleLogout = () => {
    localStorage.removeItem("coloc_user");
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <App currentUser={user} onLogout={handleLogout} />
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
