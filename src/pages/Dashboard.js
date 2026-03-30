import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import NavBar from "../components/NavBar";
import FavoriteButton from "../components/FavoriteButton";

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoadingMyRecipes, setIsLoadingMyRecipes] = useState(true);

  const storedUser = localStorage.getItem("authUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user?.name ? user.name.split(" ")[0] : "Bakker";

  const [myRecipes, setMyRecipes] = useState([]);

  const favoriteRecipes = [];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchMyRecipes = async () => {
      try {
        setError("");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/my-recipes`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Kon jouw recepten niet ophalen.");
        }

        const data = await response.json();
        setMyRecipes(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError(fetchError.message || "Er ging iets mis bij het ophalen van recepten.");
      } finally {
        setIsLoadingMyRecipes(false);
      }
    };

    fetchMyRecipes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Weet je zeker dat je dit recept wil verwijderen?")) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/recipes/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Kon recept niet verwijderen.");
      }

      setMyRecipes(myRecipes.filter((recipe) => recipe.id !== recipeId));
    } catch (deleteError) {
      setError(deleteError.message || "Er ging iets mis bij het verwijderen.");
    }
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
            <div className="section-actions">
              <button className="recipe-view-btn" onClick={() => navigate("/add-recipe")}>+ Toevoegen</button>
              
            </div>
          </div>

          <div className="recipe-grid">
            {isLoadingMyRecipes ? (
              <p>Jouw recepten laden...</p>
            ) : myRecipes.length === 0 ? (
              <p>Je hebt nog geen eigen recepten.</p>
            ) : (
              myRecipes.map((recipe) => (
                <article key={recipe.id} className="recipe-card">
                  <div className="recipe-image">
                    {recipe.image ? <img src={recipe.image} alt={recipe.title} className="recipe-image-img" /> : null}
                    <FavoriteButton />
                  </div>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.category || "Geen categorie"}</p>
                  <div className="recipe-card-actions">
                    <button className="recipe-view-btn" onClick={() => navigate(`/edit-recipe/${recipe.id}`)}>Bewerken</button>
                    <button className="recipe-view-btn recipe-delete-btn" onClick={() => handleDeleteRecipe(recipe.id)}>Verwijderen</button>
                  </div>
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
