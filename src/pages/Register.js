import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const logo = require("../images/logo.png");

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Vul alle velden in.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const validationErrors = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : "Registreren mislukt.";
        setError(data.message || validationErrors);
        return;
      }

      navigate("/");
    } catch {
      setError("Kan geen verbinding maken met de server.");
    } finally {
      setIsLoading(false);
    }
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
          type="text"
          placeholder="Naam"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="auth-input"
        />
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
        <button type="submit" className="auth-primary-btn" disabled={isLoading}>
          {isLoading ? "Bezig met registreren..." : "Registreren"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="auth-secondary-btn"
        >
          Terug naar inloggen
        </button>
      </form>
    </div>
  );
}
