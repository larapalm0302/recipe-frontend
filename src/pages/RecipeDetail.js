import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/recipes.css";
import spaghettiCarbonara from "../images/Spaghetti-carbonara.jpg";
import tomatensoep from "../images/tomatensoep-nieuw.jpg";
import avocadoToast from "../images/images.jpeg";
import chocolateCake from "../images/500.jpg";
import caesarSalad from "../images/img_RAM_PRD181288_1224x900_JPG.avif";
import sushiRolls from "../images/Crab_Sushi_Roll-spaced.jpg";

const staticRecipeDetails = {
  "static-carbonara": {
    id: "static-carbonara",
    title: "Pasta Carbonara",
    category: "Hoofdgerecht",
    image: spaghettiCarbonara,
    description: "Romige Italiaanse pastaklassieker met spek, ei en Parmezaanse kaas.",
    ingredients: "Spaghetti, eieren, spekblokjes, Parmezaanse kaas, zwarte peper, zout.",
    instructions:
      "Kook de pasta al dente. Bak de spekjes krokant. Meng eieren met Parmezaan en peper. Meng warme pasta met spek en haal van het vuur. Voeg het eimengsel toe en roer snel tot een romige saus.",
  },
  "static-tomatensoep": {
    id: "static-tomatensoep",
    title: "Tomatensoep",
    category: "Voorgerecht",
    image: tomatensoep,
    description: "Frisse tomatensoep met basilicum, perfect als lichte starter.",
    ingredients: "Tomaten, ui, knoflook, groentebouillon, basilicum, olijfolie, peper, zout.",
    instructions:
      "Fruit ui en knoflook in olijfolie. Voeg tomaten en bouillon toe en laat 20 minuten zacht koken. Pureer glad en breng op smaak met basilicum, peper en zout.",
  },
  "static-avocado-toast": {
    id: "static-avocado-toast",
    title: "Avocado Toast",
    category: "Ontbijt",
    image: avocadoToast,
    description: "Snel en voedzaam ontbijt met romige avocado op knapperig brood.",
    ingredients: "Volkorenbrood, avocado, citroensap, chilivlokken, peper, zout.",
    instructions:
      "Rooster het brood. Prak de avocado met citroensap, peper en zout. Smeer op de toast en werk af met chilivlokken.",
  },
  "static-chocolate-cake": {
    id: "static-chocolate-cake",
    title: "Chocolate Cake",
    category: "Dessert",
    image: chocolateCake,
    description: "Rijke chocoladecake met zachte kruim en diepe cacaosmaak.",
    ingredients: "Bloem, cacao, suiker, eieren, boter, melk, bakpoeder, snufje zout.",
    instructions:
      "Meng droge en natte ingrediënten apart en combineer. Giet in een ingevette vorm en bak 35-40 minuten op 175 graden. Laat afkoelen voor serveren.",
  },
  "static-caesar-salad": {
    id: "static-caesar-salad",
    title: "Caesar Salad",
    category: "Lunch",
    image: caesarSalad,
    description: "Klassieke salade met krokante sla, dressing en croutons.",
    ingredients: "Romaine sla, croutons, Parmezaan, kip (optioneel), caesardressing.",
    instructions:
      "Snijd de sla en meng met dressing. Voeg croutons en Parmezaan toe. Top eventueel af met gegrilde kip in plakjes.",
  },
  "static-sushi-rolls": {
    id: "static-sushi-rolls",
    title: "Sushi Rolls",
    category: "Diner",
    image: sushiRolls,
    description: "Zelfgemaakte sushirolletjes met rijst, nori en verse vulling.",
    ingredients: "Sushirijst, nori, komkommer, avocado, surimi of zalm, rijstazijn.",
    instructions:
      "Kook en breng de rijst op smaak. Leg nori op een matje en verdeel rijst dun. Voeg vulling toe, rol strak op en snijd in gelijke stukken.",
  },
};

export default function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const staticRecipe = useMemo(() => staticRecipeDetails[id] || null, [id]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }

    if (staticRecipe) {
      setRecipe(staticRecipe);
      setIsLoading(false);
      return;
    }

    const fetchRecipe = async () => {
      try {
        setError("");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api/recipes/${id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Kon receptdetails niet ophalen.");
        }

        const data = await response.json();
        setRecipe(data);
      } catch (fetchError) {
        setError(fetchError.message || "Er ging iets mis bij het ophalen van details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate, staticRecipe]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  };

  return (
    <div className="recipes-page">
      <NavBar onLogout={handleLogout} />

      <main className="recipes-wrap">
        <div className="recipes-head">
          <h1>Recept Details</h1>
          <button className="recipe-view-btn" onClick={() => navigate("/recipes")}>
            Terug
          </button>
        </div>

        {isLoading ? (
          <p>Details laden...</p>
        ) : error ? (
          <p className="recipes-error">{error}</p>
        ) : !recipe ? (
          <p>Recept niet gevonden.</p>
        ) : (
          <article className="recipes-card recipe-detail-card">
            <div className="recipe-detail-image-wrap">
              {recipe.image ? <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" /> : null}
            </div>

            <h2 className="recipe-detail-title">{recipe.title}</h2>
            <p className="recipe-detail-category">Categorie: {recipe.category || "Geen categorie"}</p>

            <section className="recipe-detail-section">
              <h3>Beschrijving</h3>
              <p>{recipe.description || "Geen beschrijving beschikbaar."}</p>
            </section>

            <section className="recipe-detail-section">
              <h3>Ingrediënten</h3>
              <p>{recipe.ingredients || "Geen ingrediënten beschikbaar."}</p>
            </section>

            <section className="recipe-detail-section">
              <h3>Bereiding</h3>
              <p>{recipe.instructions || "Geen bereidingsstappen beschikbaar."}</p>
            </section>
          </article>
        )}
      </main>
    </div>
  );
}
