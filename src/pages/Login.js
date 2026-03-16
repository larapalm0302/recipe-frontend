import React, { useState } from "react";
import "../styles/login.css";

const logo = require("../images/logo.png");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hier kun je je login logica toevoegen
    if (!email || !password) {
      setError("Vul alle velden in.");
      return;
    }
    setError("");
    // Simuleer login
    alert("Inloggen... (vervang door echte login)");
  };

  return (
    <div className="auth-page">
      <img
        src={logo}
        alt="Flour Power Bakery Logo"
        className="auth-logo"
      />
      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >
        <h2 className="auth-title">
          Welkom bij Flour Power
        </h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        {error && <div className="auth-error">{error}</div>}
        <button
          type="submit"
          className="auth-primary-btn"
        >
          Inloggen
        </button>
        <button
          type="button"
          onClick={() => (window.location.href = "/register")}
          className="auth-secondary-btn"
        >
          Registreren
        </button>
      </form>
    </div>
  );
}
