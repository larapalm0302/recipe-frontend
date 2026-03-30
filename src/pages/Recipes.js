import React from "react";
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

export default function Recipes() {
	const navigate = useNavigate();

	const recipes = [
		{ title: "Pasta Carbonara", category: "Hoofdgerecht", image: spaghettiCarbonara },
		{ title: "Tomatensoep", category: "Voorgerecht", image: tomatensoep },
		{ title: "Avocado Toast", category: "Ontbijt", image: avocadoToast },
		{ title: "Chocolate Cake", category: "Dessert", image: chocolateCake },
		{ title: "Caesar Salad", category: "Lunch", image: caesarSalad },
		{ title: "Sushi Rolls", category: "Diner", image: sushiRolls },
	];

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
					<h1>Alle Recepten</h1>
					<span>{recipes.length} recepten</span>
				</div>

				<div className="recipes-grid">
					{recipes.map((recipe) => (
						<article key={recipe.title} className="recipes-card">
							<div className="recipes-image">
								<img src={recipe.image} alt={recipe.title} className="recipes-image-img" />
								<FavoriteButton />
							</div>
							<h3>{recipe.title}</h3>
							<p>{recipe.category}</p>
							<button className="recipe-view-btn" onClick={() => navigate("/recipes")}>
								Bekijk recept
							</button>
						</article>
					))}
				</div>
			</main>
		</div>
	);
}
