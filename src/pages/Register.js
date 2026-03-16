import React, { useState } from "react";
import "../styles/login.css";

const logo = require("../images/logo.png");

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // Hier kun je je registratie logica toevoegen
    if (!email || !password || !confirmPassword) {
      setError("Vul alle velden in.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }
    setError("");
    // Simuleer registratie
    alert("Registreren... (vervang door echte registratie)");
  };

  return (
    <div className="auth-page">
      <img
        src={logo}
        alt="Flour Power Bakery Logo"
        className="auth-logo"
      />
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Maak een account aan</h2>
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
        <input
          type="password"
          placeholder="Bevestig wachtwoord"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="auth-input"
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="auth-primary-btn">
          Registreren
        </button>
        <button
          type="button"
          onClick={() => (window.location.href = "/login")}
          className="auth-secondary-btn"
        >
          Terug naar inloggen
        </button>
      </form>
    </div>
  );
}
