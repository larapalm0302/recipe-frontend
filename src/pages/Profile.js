import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import NavBar from "../components/NavBar";

export default function Profile() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("authUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user?.name ? user.name.split(" ")[0] : "Bakker";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  };

  return (
    <div className="profile-page">
      <NavBar onLogout={handleLogout} />

      <main className="profile-card-wrap">
        <h1 className="profile-title">Welkom, {firstName}</h1>

        <section className="profile-section">
          <h2>Jouw Profiel</h2>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-label">Naam</span>
              <p>{user?.name || "Niet beschikbaar"}</p>
            </div>

            <div className="profile-info-item">
              <span className="profile-label">E-mail</span>
              <p>{user?.email || "Niet beschikbaar"}</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>Acties</h2>

          <div className="profile-actions">
            <button className="profile-btn" onClick={() => navigate("/dashboard")}>Terug naar dashboard</button>
            <button className="profile-btn profile-btn-danger" onClick={handleLogout}>Uitloggen</button>
          </div>
        </section>
      </main>
    </div>
  );
}