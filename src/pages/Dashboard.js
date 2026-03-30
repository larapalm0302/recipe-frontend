import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import NavBar from "../components/NavBar";
import FavoriteButton from "../components/FavoriteButton";
import spaghettiCarbonara from "../images/Spaghetti-carbonara.jpg";
import tomatensoep from "../images/tomatensoep-nieuw.jpg";
import avocadoToast from "../images/images.jpeg";
import chocolateCake from "../images/500.jpg";
import caesarSalad from "../images/img_RAM_PRD181288_1224x900_JPG.avif";
import sushiRolls from "../images/Crab_Sushi_Roll-spaced.jpg";

const STATIC_RECIPE_FAVORITES_KEY = "staticFavoriteRecipes";

const staticRecipes = [
  { id: "static-carbonara", title: "Pasta Carbonara", category: "Hoofdgerecht", image: spaghettiCarbonara },
  { id: "static-tomatensoep", title: "Tomatensoep", category: "Voorgerecht", image: tomatensoep },
  { id: "static-avocado-toast", title: "Avocado Toast", category: "Ontbijt", image: avocadoToast },
  { id: "static-chocolate-cake", title: "Chocolate Cake", category: "Dessert", image: chocolateCake },
  { id: "static-caesar-salad", title: "Caesar Salad", category: "Lunch", image: caesarSalad },
  { id: "static-sushi-rolls", title: "Sushi Rolls", category: "Diner", image: sushiRolls },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoadingMyRecipes, setIsLoadingMyRecipes] = useState(true);

  const storedUser = localStorage.getItem("authUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user?.name ? user.name.split(" ")[0] : "Bakker";

  const [myRecipes, setMyRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [favoriteMap, setFavoriteMap] = useState({});
  const [staticFavoriteRecipes, setStaticFavoriteRecipes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setError("");

        const rawStaticFavorites = localStorage.getItem(STATIC_RECIPE_FAVORITES_KEY);
        const staticFavoriteIds = rawStaticFavorites ? JSON.parse(rawStaticFavorites) : [];
        const mappedStaticFavorites = Array.isArray(staticFavoriteIds)
          ? staticRecipes.filter((recipe) => staticFavoriteIds.includes(recipe.id))
          : [];

        const [myRecipesResponse, myFavoritesResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/my-recipes`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/my-favorites`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!myRecipesResponse.ok) {
          const data = await myRecipesResponse.json().catch(() => ({}));
          throw new Error(data.message || "Kon jouw recepten niet ophalen.");
        }

        if (!myFavoritesResponse.ok) {
          const data = await myFavoritesResponse.json().catch(() => ({}));
          throw new Error(data.message || "Kon favorieten niet ophalen.");
        }

        const myRecipesData = await myRecipesResponse.json();
        const favoritesData = await myFavoritesResponse.json();

        const safeMyRecipes = Array.isArray(myRecipesData) ? myRecipesData : [];
        const safeFavorites = Array.isArray(favoritesData) ? favoritesData : [];

        const favoriteByRecipe = {};
        const mappedFavoriteRecipes = [];

        safeFavorites.forEach((favorite) => {
          if (favorite?.recipe_id && favorite?.id) {
            favoriteByRecipe[favorite.recipe_id] = favorite.id;
          }

          if (favorite?.recipe) {
            mappedFavoriteRecipes.push(favorite.recipe);
          }
        });

        setMyRecipes(safeMyRecipes);
        setFavoriteMap(favoriteByRecipe);
        setFavoriteRecipes(mappedFavoriteRecipes);
        setStaticFavoriteRecipes(mappedStaticFavorites);
      } catch (fetchError) {
        setError(fetchError.message || "Er ging iets mis bij het ophalen van data.");
      } finally {
        setIsLoadingMyRecipes(false);
      }
    };

    fetchData();
  }, [navigate]);

  const allFavoriteRecipes = useMemo(
    () => [
      ...staticFavoriteRecipes.map((recipe) => ({ ...recipe, source: "static" })),
      ...favoriteRecipes.map((recipe) => ({ ...recipe, source: "api" })),
    ],
    [staticFavoriteRecipes, favoriteRecipes]
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  };

  const handleFavoriteChange = async (recipeId, isNowFavorite) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      setError("");

      if (isNowFavorite) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/favorites`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ recipe_id: recipeId }),
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Kon recept niet toevoegen aan favorieten.");
        }
      } else {
        const favoriteId = favoriteMap[recipeId];
        if (!favoriteId) {
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/favorites/${favoriteId}`,
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
          throw new Error(data.message || "Kon recept niet verwijderen uit favorieten.");
        }
      }

      const favoritesResponse = await fetch(
        `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/my-favorites`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!favoritesResponse.ok) {
        const data = await favoritesResponse.json().catch(() => ({}));
        throw new Error(data.message || "Kon favorieten niet verversen.");
      }

      const favoritesData = await favoritesResponse.json();
      const safeFavorites = Array.isArray(favoritesData) ? favoritesData : [];
      const favoriteByRecipe = {};
      const mappedFavoriteRecipes = [];

      safeFavorites.forEach((favorite) => {
        if (favorite?.recipe_id && favorite?.id) {
          favoriteByRecipe[favorite.recipe_id] = favorite.id;
        }

        if (favorite?.recipe) {
          mappedFavoriteRecipes.push(favorite.recipe);
        }
      });

      setFavoriteMap(favoriteByRecipe);
      setFavoriteRecipes(mappedFavoriteRecipes);
    } catch (favoriteError) {
      setError(favoriteError.message || "Er ging iets mis met favorieten.");
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
              <button className="recipe-view-btn" onClick={() => navigate("/add-recipe")}>
                + Toevoegen
              </button>
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
                    <FavoriteButton
                      initialFavorite={Boolean(favoriteMap[recipe.id])}
                      onChange={(isNowFavorite) => handleFavoriteChange(recipe.id, isNowFavorite)}
                    />
                  </div>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.category || "Geen categorie"}</p>
                  <div className="recipe-card-actions">
                    <button className="recipe-view-btn" onClick={() => navigate(`/edit-recipe/${recipe.id}`)}>
                      Bewerken
                    </button>
                    <button className="recipe-view-btn" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                      Bekijk
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-head">
            <h2>Favoriete Recepten</h2>
            <span onClick={() => navigate("/recipes")} style={{ cursor: "pointer" }}>
              Bekijk alles
            </span>
          </div>

          <div className="recipe-grid">
            {allFavoriteRecipes.length === 0 ? (
              <p>Je hebt nog geen favoriete recepten.</p>
            ) : (
              allFavoriteRecipes.map((recipe) => (
                <article key={`${recipe.source}-${recipe.id}`} className="recipe-card">
                  <div className="recipe-image">
                    {recipe.image ? <img src={recipe.image} alt={recipe.title} className="recipe-image-img" /> : null}
                    <FavoriteButton initialFavorite={true} disabled />
                  </div>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.category || "Geen categorie"}</p>
                  <button className="recipe-view-btn" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                    Bekijk recept
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
