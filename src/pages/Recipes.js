import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/recipes.css";
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

export default function Recipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [favoriteMap, setFavoriteMap] = useState({});
  const [staticFavoriteMap, setStaticFavoriteMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const totalRecipes = useMemo(() => staticRecipes.length + recipes.length, [recipes.length]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const rawStaticFavorites = localStorage.getItem(STATIC_RECIPE_FAVORITES_KEY);
      const staticFavoriteIds = rawStaticFavorites ? JSON.parse(rawStaticFavorites) : [];
      const nextStaticFavoriteMap = {};

      if (Array.isArray(staticFavoriteIds)) {
        staticFavoriteIds.forEach((id) => {
          nextStaticFavoriteMap[id] = true;
        });
      }

      setStaticFavoriteMap(nextStaticFavoriteMap);
    } catch {
      setStaticFavoriteMap({});
    }

    const fetchData = async () => {
      try {
        setError("");

        const [recipesResponse, favoritesResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/recipes`, {
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

        if (!recipesResponse.ok) {
          const data = await recipesResponse.json().catch(() => ({}));
          throw new Error(data.message || "Kon recepten niet ophalen.");
        }

        if (!favoritesResponse.ok) {
          const data = await favoritesResponse.json().catch(() => ({}));
          throw new Error(data.message || "Kon favorieten niet ophalen.");
        }

        const recipesData = await recipesResponse.json();
        const favoritesData = await favoritesResponse.json();

        const safeRecipes = Array.isArray(recipesData) ? recipesData : [];
        const safeFavorites = Array.isArray(favoritesData) ? favoritesData : [];

        const favoriteByRecipe = {};
        safeFavorites.forEach((favorite) => {
          if (favorite?.recipe_id && favorite?.id) {
            favoriteByRecipe[favorite.recipe_id] = favorite.id;
          }
        });

        setRecipes(safeRecipes);
        setFavoriteMap(favoriteByRecipe);
      } catch (fetchError) {
        setError(fetchError.message || "Er ging iets mis bij het ophalen van recepten.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  };

  const refreshFavoriteMap = async (token) => {
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

    safeFavorites.forEach((favorite) => {
      if (favorite?.recipe_id && favorite?.id) {
        favoriteByRecipe[favorite.recipe_id] = favorite.id;
      }
    });

    setFavoriteMap(favoriteByRecipe);
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

      await refreshFavoriteMap(token);
    } catch (favoriteError) {
      setError(favoriteError.message || "Er ging iets mis met favorieten.");
    }
  };

  const handleStaticFavoriteChange = (staticRecipeId, isNowFavorite) => {
    const nextStaticFavoriteMap = {
      ...staticFavoriteMap,
      [staticRecipeId]: isNowFavorite,
    };

    if (!isNowFavorite) {
      delete nextStaticFavoriteMap[staticRecipeId];
    }

    setStaticFavoriteMap(nextStaticFavoriteMap);

    const favoriteIds = Object.keys(nextStaticFavoriteMap).filter((id) => nextStaticFavoriteMap[id]);
    localStorage.setItem(STATIC_RECIPE_FAVORITES_KEY, JSON.stringify(favoriteIds));
  };

  return (
    <div className="recipes-page">
      <NavBar onLogout={handleLogout} />

      <main className="recipes-wrap">
        <div className="recipes-head">
          <h1>Alle Recepten</h1>
          <span>{totalRecipes} recepten</span>
        </div>

        {error && <p className="recipes-error">{error}</p>}

        <h2 className="recipes-section-title">Standaard Recepten</h2>
        <div className="recipes-grid">
          {staticRecipes.map((recipe) => (
            <article key={recipe.id} className="recipes-card">
              <div className="recipes-image">
                <img src={recipe.image} alt={recipe.title} className="recipes-image-img" />
                <FavoriteButton
                  initialFavorite={Boolean(staticFavoriteMap[recipe.id])}
                  onChange={(isNowFavorite) => handleStaticFavoriteChange(recipe.id, isNowFavorite)}
                />
              </div>
              <h3>{recipe.title}</h3>
              <p>{recipe.category}</p>
              <button className="recipe-view-btn" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                Bekijk recept
              </button>
            </article>
          ))}
        </div>

        <h2 className="recipes-section-title">Aangemaakte Recepten</h2>
        {isLoading ? (
          <p>Recepten laden...</p>
        ) : recipes.length === 0 ? (
          <p>Er zijn nog geen extra recepten beschikbaar.</p>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <article key={recipe.id} className="recipes-card">
                <div className="recipes-image">
                  {recipe.image ? <img src={recipe.image} alt={recipe.title} className="recipes-image-img" /> : null}
                  <FavoriteButton
                    initialFavorite={Boolean(favoriteMap[recipe.id])}
                    onChange={(isNowFavorite) => handleFavoriteChange(recipe.id, isNowFavorite)}
                  />
                </div>
                <h3>{recipe.title}</h3>
                <p>{recipe.category || "Geen categorie"}</p>
                <button className="recipe-view-btn" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                  Bekijk recept
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
