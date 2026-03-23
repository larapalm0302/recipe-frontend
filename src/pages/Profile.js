import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import NavBar from "../components/NavBar";

export default function Profile() {
  const navigate = useNavigate();
  const [error] = useState("");
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
                <h1 className="profile-title">Welkom terug, {firstName}</h1>
                {error && <p className="profile-error">{error}</p>}
                <section className="profile-section">
                    <h2>Jouw Profiel</h2>
                    <div className="profile-info">
                        <p><strong>Naam:</strong> {user?.name || "Bakker"}</p>
                        
                    </div>
                </section>
            </main>     
    </div>
    );
}