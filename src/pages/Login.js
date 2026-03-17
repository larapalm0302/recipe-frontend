import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const logo = require("../images/logo.png");

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vul alle velden in.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Inloggen mislukt.");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      navigate("/dashboard");
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
          disabled={isLoading}
        >
          {isLoading ? "Bezig met inloggen..." : "Inloggen"}
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
