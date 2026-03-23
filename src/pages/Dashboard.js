import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import NavBar from "../components/NavBar";
import FavoriteButton from "../components/FavoriteButton";

export default function Dashboard() {
  const navigate = useNavigate();
  const [error] = useState("");

  const storedUser = localStorage.getItem("authUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user?.name ? user.name.split(" ")[0] : "Bakker";

  const myRecipes = [];

  const favoriteRecipes = [];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <NavBar onLogout={handleLogout} />

      <main className="dashboard-card-wrap">
        <h1 className="dashboard-title">Welkom terug, {firstName}</h1>
        {error && <p className="dashboard-error">{error}</p>}

        <section className="dashboard-section">
          <div className="section-head">
            <h2>Jouw Recepten</h2>
            <span onClick={() => navigate("/recipes")} style={{ cursor: "pointer" }}>Bekijk alles</span>
          </div>

          <div className="recipe-grid">
            {myRecipes.length === 0 ? (
              <p>Je hebt nog geen eigen recepten.</p>
            ) : (
              myRecipes.map((recipe) => (
                <article key={recipe.title} className="recipe-card">
                  <div className="recipe-image">
                    <FavoriteButton />
                  </div>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.tag}</p>
                  <button className="recipe-view-btn" onClick={() => navigate("/recipes")}>Bekijk recept</button>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-head">
            <h2>Favoriete Recepten</h2>
            <span onClick={() => navigate("/recipes")} style={{ cursor: "pointer" }}>Bekijk alles</span>
          </div>

          <div className="recipe-grid">
            {favoriteRecipes.length === 0 ? (
              <p>Je hebt nog geen favoriete recepten.</p>
            ) : (
              favoriteRecipes.map((recipe) => (
                <article key={recipe.title} className="recipe-card">
                  <div className="recipe-image">
                    <FavoriteButton initialFavorite={true} />
                  </div>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.tag}</p>
                  <button className="recipe-view-btn" onClick={() => navigate("/recipes")}>Bekijk recept</button>
                </article>
              ))
            )}
          </div>
        </section>

        
      </main>
      </div>
    
  );
}
